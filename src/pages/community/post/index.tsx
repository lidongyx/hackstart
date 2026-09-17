import React, {useEffect, useMemo, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import Layout from '@theme/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {ArrowLeft, Bookmark, Check, ChevronRight, Eye, LoaderCircle, MessageCircle, Pencil, Send, Share2} from 'lucide-react';

import CommunityAvatar, {communityDisplayName, type CommunityUser} from '@site/src/components/community/CommunityAvatar';
import ResourceSidebar from '@site/src/components/resources/ResourceSidebar';
import {buildSub2ApiLoginURL, fetchCurrentSub2ApiUser, sub2ApiFetch, subscribeToSub2ApiAuth, type Sub2ApiUser} from '@site/src/lib/sub2api-auth';
import styles from '../styles.module.css';

type User = CommunityUser & {id: number};
type Topic = {id: number; name: string; slug: string; color: string};
type Comment = {id: number; content: string; created_at: string; author?: User};
type Post = {id: number; title: string; content?: string; view_count: number; comment_count: number; created_at: string; updated_at: string; author?: User; topic?: Topic; comments?: Comment[]; can_edit?: boolean};

const FAVORITES_KEY = 'hackstart_community_favorites';

function formatDate(value?: string) {
  if (!value) return '未知时间';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '未知时间';
  return new Intl.DateTimeFormat('zh-CN', {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'}).format(parsed);
}

function readFavorites() {
  if (typeof window === 'undefined') return [];
  try {
    const values = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || '[]') as unknown;
    return Array.isArray(values) ? values.map(Number).filter(Number.isFinite) : [];
  } catch {
    return [];
  }
}

export default function CommunityPostPage(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const {search} = useLocation();
  const apiBase = String(siteConfig.customFields?.communityApiBaseUrl || '');
  const loginURL = String(siteConfig.customFields?.membershipLoginUrl || 'https://hackstart.org/login');
  const postId = useMemo(() => Number(new URLSearchParams(search).get('id')), [search]);
  const [post, setPost] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState<Sub2ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [posting, setPosting] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setFavorited(readFavorites().includes(postId));
  }, [postId]);

  useEffect(() => {
    let mounted = true;
    if (!Number.isInteger(postId) || postId < 1) {
      setError('帖子链接无效');
      setLoading(false);
      return () => { mounted = false; };
    }
    setLoading(true);
    setError('');
    void sub2ApiFetch(`${apiBase}/posts/${postId}`, {headers: {Accept: 'application/json'}})
      .then((response) => response.ok ? response.json() as Promise<Post> : Promise.reject(new Error('帖子不存在')))
      .then((body) => mounted && setPost(body))
      .catch((reason) => mounted && setError(reason instanceof Error ? reason.message : '读取帖子失败'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [apiBase, postId]);

  useEffect(() => {
    let mounted = true;
    const syncAuth = () => void fetchCurrentSub2ApiUser().then((user) => mounted && setCurrentUser(user)).catch(() => mounted && setCurrentUser(null));
    syncAuth();
    const unsubscribe = subscribeToSub2ApiAuth(syncAuth);
    return () => { mounted = false; unsubscribe(); };
  }, []);

  function toggleFavorite() {
    const next = new Set(readFavorites());
    if (next.has(postId)) next.delete(postId);
    else next.add(postId);
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
    setFavorited(next.has(postId));
  }

  async function copyLink() {
    await navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function submitComment(event: React.FormEvent) {
    event.preventDefault();
    if (!post || !comment.trim()) return;
    setPosting(true);
    setError('');
    try {
      const response = await sub2ApiFetch(`${apiBase}/posts/${post.id}/comments`, {method: 'POST', headers: {'Content-Type': 'application/json', Accept: 'application/json'}, body: JSON.stringify({content: comment})});
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || '发表评论失败');
      setComment('');
      const refreshed = await sub2ApiFetch(`${apiBase}/posts/${post.id}`, {headers: {Accept: 'application/json'}});
      if (refreshed.ok) setPost(await refreshed.json() as Post);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '发表评论失败');
    } finally {
      setPosting(false);
    }
  }

  const loginHref = buildSub2ApiLoginURL(
    loginURL,
    typeof window === 'undefined' ? 'https://i.hackstart.org/community/' : window.location.href,
  );

  return <Layout title={post ? `${post.title} · HackStart 社区` : '社区帖子 · HackStart'} description="HackStart 社区帖子详情">
    <main className={styles.postPage}>
      <ResourceSidebar />
      <section className={styles.postPageContent}>
        {loading ? <div className={styles.postState}><LoaderCircle className={styles.spin} /><span>正在读取帖子</span></div> : error || !post ? <div className={styles.postState}><MessageCircle /><strong>{error || '帖子不存在'}</strong><Link to="/community/">返回社区</Link></div> : <article className={styles.postArticle}>
          <nav className={styles.postBreadcrumb} aria-label="面包屑"><Link to="/community/">社区</Link><ChevronRight /><span>{post.topic?.name || '讨论'}</span></nav>
          <header className={styles.postArticleHeader}>
            <span className={styles.topicBadge} style={{'--topic-color': post.topic?.color || '#0f766e'} as React.CSSProperties}>{post.topic?.name || '社区'}</span>
            <h1>{post.title}</h1>
            <div className={styles.postArticleMeta}><span className={styles.postAuthor}><CommunityAvatar className={styles.postAuthorAvatar} user={post.author} /><strong>{communityDisplayName(post.author)}</strong></span><span>发布于 {formatDate(post.created_at)}</span><span><Eye />{post.view_count} 次查看</span></div>
          </header>
          <div className={styles.postArticleBody}><div className={styles.markdown}><ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content || ''}</ReactMarkdown></div></div>
          {currentUser && post.can_edit && <Link className={styles.secondaryButton} to={`/community/?edit=${post.id}`}><Pencil size={16} />编辑帖子</Link>}
          <div className={styles.postArticleActions}><button type="button" data-active={favorited} onClick={toggleFavorite}><Bookmark />{favorited ? '已收藏' : '收藏'}</button><button type="button" onClick={() => void copyLink()}>{copied ? <Check /> : <Share2 />}{copied ? '链接已复制' : '分享帖子'}</button><span className={styles.postArticleStats}><MessageCircle /> {post.comment_count} 条回复</span></div>
          <section className={styles.postComments}><div className={styles.postCommentsHeader}><h2>全部回复 <span>{post.comments?.length || 0}</span></h2></div>{post.comments?.map((item) => <article className={styles.postComment} key={item.id}><CommunityAvatar className={styles.postCommentAvatar} user={item.author} /><div><div className={styles.postCommentTop}><strong>{communityDisplayName(item.author)}</strong><time>{formatDate(item.created_at)}</time></div><p>{item.content}</p></div></article>)}{currentUser ? <form className={styles.postCommentForm} onSubmit={submitComment}><textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={4000} placeholder="写下你的回复" required /><button type="submit" disabled={posting || !comment.trim()}><Send />{posting ? '发送中' : '发表评论'}</button></form> : <p className={styles.postLoginHint}>登录后参与讨论。<a href={loginHref}>立即登录</a></p>}</section>
        </article>}
      </section>
    </main>
  </Layout>;
}
