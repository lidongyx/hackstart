import React, {useEffect, useMemo, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import Layout from '@theme/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {ArrowRight, Bold, Code2, Eye, Heading2, Image, Italic, Link2, List, LoaderCircle, MessageCircle, MessagesSquare, Pin, Plus, Quote, Search, X} from 'lucide-react';

import CommunityAvatar, {communityDisplayName, type CommunityUser} from '@site/src/components/community/CommunityAvatar';
import ResourceSidebar from '@site/src/components/resources/ResourceSidebar';
import {fetchCurrentSub2ApiUser, sub2ApiFetch, subscribeToSub2ApiAuth, type Sub2ApiUser} from '@site/src/lib/sub2api-auth';
import styles from './styles.module.css';

type User = CommunityUser & {id: number};
type Topic = {id: number; name: string; slug: string; description: string; color: string; post_count: number};
type Comment = {id: number; content: string; created_at: string; author?: User};
type LastComment = {created_at: string; author?: User};
type Post = {id: number; title: string; content?: string; excerpt?: string; status: string; pinned: boolean; view_count: number; comment_count: number; created_at: string; updated_at: string; author?: User; topic?: Topic; last_comment?: LastComment; comments?: Comment[]; can_edit?: boolean};
type PostResponse = {items: Post[]; pagination: {page: number; pages: number; total: number}};

function date(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {year: 'numeric', month: 'short', day: 'numeric'}).format(new Date(value));
}

function relativeTime(value?: string) {
  if (!value) return '暂无回复';
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return '暂无回复';
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return '刚刚';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;
  return date(value);
}

const maxCommunityImageBytes = 100 * 1024;
const communityImageScaleSteps = [1, 0.86, 0.72, 0.58, 0.44, 0.32];
const communityImageQualitySteps = [0.9, 0.82, 0.74, 0.66, 0.58, 0.5, 0.42, 0.34];

function readFileAsDataURL(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(reader.error || new Error('读取图片失败'));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataURL: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('无法解析图片'));
    image.src = dataURL;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('图片压缩失败')), 'image/webp', quality);
  });
}

async function prepareCommunityImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) throw new Error('请选择图片文件');
  if (file.type === 'image/gif') {
    if (file.size > maxCommunityImageBytes) throw new Error('GIF 图片必须在 100KB 以内');
    return file;
  }

  const image = await loadImage(await readFileAsDataURL(file));
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('当前浏览器无法处理图片');

  const initialScale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
  for (const step of communityImageScaleSteps) {
    const scale = initialScale * step;
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.width = width;
    canvas.height = height;
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    for (const quality of communityImageQualitySteps) {
      const blob = await canvasToBlob(canvas, quality);
      if (blob.size <= maxCommunityImageBytes) {
        const baseName = file.name.replace(/\.[^.]+$/, '') || 'community-image';
        return new File([blob], `${baseName}.webp`, {type: 'image/webp'});
      }
    }
  }
  throw new Error('无法将图片压缩到 100KB 以内，请换一张更小的图片');
}

export default function CommunityPage(): React.ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const {search} = useLocation();
  const editId = Number(new URLSearchParams(search).get('edit'));
  const apiBase = String(siteConfig.customFields?.communityApiBaseUrl || '');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<Sub2ApiUser | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topicId, setTopicId] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const loginHref = `/login/?redirect=${encodeURIComponent(typeof window === 'undefined' ? '/community/' : window.location.pathname + window.location.search)}`;

  const loadTopics = () => fetch(`${apiBase}/topics`, {headers: {Accept: 'application/json'}})
    .then((response) => response.ok ? response.json() as Promise<{items: Topic[]}> : Promise.reject(new Error('无法读取主题')))
    .then((body) => setTopics(body.items || []))
    .catch(() => undefined);

  const loadPosts = () => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams({page: String(page)});
    if (selectedTopic) params.set('topic', selectedTopic);
    if (query.trim()) params.set('search', query.trim());
    return sub2ApiFetch(`${apiBase}/posts?${params}`, {headers: {Accept: 'application/json'}})
      .then((response) => response.ok ? response.json() as Promise<PostResponse> : Promise.reject(new Error('读取帖子失败')))
      .then((body) => {
        setPosts(body.items || []);
        setPages(Math.max(1, body.pagination?.pages || 1));
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : '读取帖子失败'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { void loadTopics(); }, []);
  useEffect(() => { void loadPosts(); }, [page, query, selectedTopic]);
  useEffect(() => {
    let mounted = true;
    const syncAuth = () => {
      void fetchCurrentSub2ApiUser()
        .then((user) => mounted && setCurrentUser(user))
        .catch(() => mounted && setCurrentUser(null));
    };
    syncAuth();
    const unsubscribe = subscribeToSub2ApiAuth(syncAuth);
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const selectedTopicObject = useMemo(() => topics.find((topic) => topic.id === topicId), [topicId, topics]);

  function openCreate() {
    if (!currentUser) {
      window.location.assign(loginHref);
      return;
    }
    setError('');
    setEditingPost(null);
    setTitle('');
    setContent('');
    setImageUploadError('');
    setTopicId(topics[0]?.id || 0);
    setEditorOpen(true);
  }

  function openEdit(post: Post) {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content || '');
    setImageUploadError('');
    setTopicId(post.topic?.id || topics[0]?.id || 0);
    setEditorOpen(true);
  }

  function insertMarkdown(before: string, after = '') {
    const textarea = document.getElementById('community-markdown-editor') as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);
    const replacement = selected || '文本';
    const next = `${content.slice(0, start)}${before}${replacement}${after}${content.slice(end)}`;
    setContent(next);
    window.requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + before.length + replacement.length + after.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  useEffect(() => {
    if (!currentUser || !Number.isInteger(editId) || editId < 1) return;
    let active = true;
    void sub2ApiFetch(`${apiBase}/posts/${editId}`, {headers: {Accept: 'application/json'}})
      .then(async response => {
        if (!response.ok) throw new Error('读取待编辑帖子失败');
        const post = await response.json() as Post;
        if (!post.can_edit) throw new Error('你没有编辑此帖子的权限');
        if (active) openEdit(post);
      })
      .catch(cause => {if (active) setError(cause instanceof Error ? cause.message : '读取待编辑帖子失败');});
    return () => {active = false;};
  }, [apiBase, editId, currentUser?.id]);

  function insertImageMarkdown(url: string) {
    const textarea = document.getElementById('community-markdown-editor') as HTMLTextAreaElement | null;
    const start = textarea?.selectionStart ?? content.length;
    const end = textarea?.selectionEnd ?? content.length;
    const prefix = start > 0 && content[start - 1] !== '\n' ? '\n' : '';
    const suffix = end < content.length && content[end] !== '\n' ? '\n' : '';
    const markdown = `${prefix}![图片](${url})${suffix}`;
    setContent(`${content.slice(0, start)}${markdown}${content.slice(end)}`);
    window.requestAnimationFrame(() => {
      textarea?.focus();
      const cursor = start + markdown.length;
      textarea?.setSelectionRange(cursor, cursor);
    });
  }

  async function uploadEditorImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploadingImage(true);
    setImageUploadError('');
    try {
      const prepared = await prepareCommunityImage(file);
      const form = new FormData();
      form.append('file', prepared);
      const response = await sub2ApiFetch(`${apiBase}/media`, {
        method: 'POST',
        headers: {Accept: 'application/json'},
        body: form,
      });
      const body = await response.json().catch(() => ({})) as {url?: string; message?: string};
      if (!response.ok || !body.url) throw new Error(body.message || '上传图片失败');
      insertImageMarkdown(body.url);
    } catch (reason) {
      setImageUploadError(reason instanceof Error ? reason.message : '上传图片失败');
    } finally {
      setUploadingImage(false);
    }
  }

  async function savePost(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const path = editingPost ? `${apiBase}/posts/${editingPost.id}` : `${apiBase}/posts`;
      const response = await sub2ApiFetch(path, {
        method: editingPost ? 'PATCH' : 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify({title, content, topic_id: topicId}),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || '保存帖子失败');
      setEditorOpen(false);
      setPage(1);
      await loadPosts();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '保存帖子失败');
    } finally {
      setSaving(false);
    }
  }

  return <Layout title="社区 · 技术交流" description="HackStart 社区技术交流">
    <main className={styles.shell}>
      <ResourceSidebar />
      <section className={styles.content}>
        <header className={styles.header}>
          <span className={styles.headerLabel}><MessagesSquare />社区讨论</span>
          {currentUser ? <button type="button" className={styles.primaryButton} onClick={openCreate}><Plus />发起讨论</button> : <a className={styles.secondaryButton} href={loginHref}>登录后发帖 <ArrowRight /></a>}
        </header>
        <aside className={styles.topicRail}>
          <button type="button" className={`${styles.topicItem} ${!selectedTopic ? styles.topicActive : ''}`} onClick={() => {setSelectedTopic(''); setPage(1);}}>全部讨论<span>{topics.reduce((total, topic) => total + topic.post_count, 0)}</span></button>
          {topics.map((topic) => <button type="button" key={topic.id} className={`${styles.topicItem} ${selectedTopic === topic.slug ? styles.topicActive : ''}`} onClick={() => {setSelectedTopic(topic.slug); setPage(1);}}><i style={{background: topic.color}} />{topic.name}<span>{topic.post_count}</span></button>)}
          <div className={styles.topicNote}>话题由管理员维护，发帖时只能选择已启用主题。</div>
        </aside>
        <div className={styles.layout}>
          <section className={styles.feed}>
            <div className={styles.feedToolbar}><label className={styles.search}><Search /><input value={query} onChange={(event) => {setQuery(event.target.value); setPage(1);}} placeholder="搜索帖子、作者或正文" /></label><span>{loading ? '正在加载' : `${posts.length} 条讨论`}</span></div>
            {error && <p className={styles.error}>{error}</p>}
            {loading && posts.length === 0 && <div className={styles.loading}><LoaderCircle className={styles.spin} />正在读取社区内容</div>}
            {!loading && posts.length === 0 && <div className={styles.empty}><MessagesSquare /><strong>还没有相关讨论</strong><span>成为第一个分享经验的人。</span></div>}
            <div className={styles.postList}>
              {posts.map((post) => <Link className={styles.postCard} key={post.id} to={`/community/post/?id=${post.id}`}>
                <CommunityAvatar className={styles.postAvatar} user={post.author} />
                <div className={styles.postMain}>
                  <div className={styles.postMeta}><span>{communityDisplayName(post.author)}</span><time>{date(post.created_at)}</time>{post.pinned && <b><Pin />置顶</b>}</div>
                  <h2>{post.title}</h2>
                  <div className={styles.postFooter}><span className={styles.topicBadge} style={{'--topic-color': post.topic?.color || '#0f766e'} as React.CSSProperties}>{post.topic?.name || '社区'}</span><span><MessageCircle />{post.comment_count}</span><span><Eye />{post.view_count}</span>{post.last_comment ? <span className={styles.lastReply}>最后回复来自 <strong>{communityDisplayName(post.last_comment.author)}</strong><em>{relativeTime(post.last_comment.created_at)}</em></span> : <span className={styles.lastReply}>暂无回复</span>}</div>
                </div>
              </Link>)}
            </div>
            <div className={styles.pagination}><button type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>上一页</button><span>{page} / {pages}</span><button type="button" disabled={page >= pages} onClick={() => setPage((value) => value + 1)}>下一页</button></div>
          </section>
        </div>
      </section>
      {editorOpen && <div className={styles.overlay} onClick={(event) => {if (event.target === event.currentTarget) setEditorOpen(false);}}><form className={styles.editor} onSubmit={savePost}><header><div><p className={styles.kicker}>{editingPost ? 'EDIT DISCUSSION' : 'NEW DISCUSSION'}</p><h2>{editingPost ? '编辑帖子' : '发起讨论'}</h2></div><button type="button" className={styles.iconButton} title="关闭" onClick={() => setEditorOpen(false)}><X /></button></header><label>标题<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160} required placeholder="清晰描述你想讨论的问题" /></label><div className={styles.topicPicker}><span>主题</span><div>{topics.map((topic) => <button type="button" key={topic.id} className={topicId === topic.id ? styles.topicPillActive : styles.topicPill} onClick={() => setTopicId(topic.id)}><i style={{background: topic.color}} />{topic.name}</button>)}</div>{selectedTopicObject && <small>{selectedTopicObject.description}</small>}</div><div className={styles.editorGrid}><label>Markdown 正文<div className={styles.markdownEditor}><div className={styles.markdownToolbar} aria-label="Markdown 工具栏"><button type="button" title="粗体" onClick={() => insertMarkdown('**', '**')}><Bold /></button><button type="button" title="斜体" onClick={() => insertMarkdown('*', '*')}><Italic /></button><button type="button" title="标题" onClick={() => insertMarkdown('## ')}><Heading2 /></button><button type="button" title="代码" onClick={() => insertMarkdown('`', '`')}><Code2 /></button><button type="button" title="链接" onClick={() => insertMarkdown('[', '](https://)')}><Link2 /></button><button type="button" title="引用" onClick={() => insertMarkdown('> ')}><Quote /></button><button type="button" title="列表" onClick={() => insertMarkdown('- ')}><List /></button><button type="button" title={uploadingImage ? '图片上传中' : '上传图片'} disabled={uploadingImage} onClick={() => imageInputRef.current?.click()}>{uploadingImage ? <LoaderCircle className={styles.spin} /> : <Image />}</button><input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={(event) => void uploadEditorImage(event)} /></div>{imageUploadError && <span className={styles.editorUploadError}>{imageUploadError}</span>}<textarea id="community-markdown-editor" value={content} onChange={(event) => setContent(event.target.value)} rows={15} required placeholder="# 你的问题或经验\n\n支持 Markdown 和 GFM 语法" /></div></label><div className={styles.preview}><span>预览</span><div className={styles.markdown}><ReactMarkdown remarkPlugins={[remarkGfm]}>{content || '输入正文后将在这里预览。'}</ReactMarkdown></div></div></div><footer><span>{content.length} / 50000</span><div><button type="button" className={styles.secondaryButton} onClick={() => setEditorOpen(false)}>取消</button><button className={styles.primaryButton} disabled={saving || uploadingImage || !topics.length}><LoaderCircle className={saving ? styles.spin : ''} />{saving ? '发布中' : '发布帖子'}</button></div></footer></form></div>}
    </main>
  </Layout>;
}
