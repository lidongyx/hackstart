import React, {useEffect, useMemo, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import Layout from '@theme/Layout';
import {Bookmark, Eye, FileText, LoaderCircle, MessageCircle} from 'lucide-react';

import ResourceSidebar from '@site/src/components/resources/ResourceSidebar';
import type {CommunityUser} from '@site/src/components/community/CommunityAvatar';
import {buildSub2ApiLoginURL, fetchCurrentSub2ApiUser, sub2ApiFetch, type Sub2ApiUser} from '@site/src/lib/sub2api-auth';
import styles from '../styles.module.css';

type User = CommunityUser & {id: number};
type Topic = {id: number; name: string; color: string};
type Post = {id: number; title: string; view_count: number; comment_count: number; created_at: string; updated_at: string; status?: string; topic?: Topic};
type Comment = {id: number; content: string; created_at: string; post?: {id: number; title: string}; author?: User};
type PageResponse<T> = {items: T[]; pagination: {page: number; pages: number; total: number}};

const FAVORITES_KEY = 'hackstart_community_favorites';
type Tab = 'favorites' | 'posts' | 'comments';

function formatDate(value?: string) {
  if (!value) return '未知时间';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '未知时间' : new Intl.DateTimeFormat('zh-CN', {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'}).format(parsed);
}

function tabFromSearch(search: string): Tab {
  const value = new URLSearchParams(search).get('tab');
  return value === 'posts' || value === 'comments' ? value : 'favorites';
}

export default function CommunityMinePage(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const {search} = useLocation();
  const apiBase = String(siteConfig.customFields?.communityApiBaseUrl || '');
  const loginURL = String(siteConfig.customFields?.membershipLoginUrl || 'https://hackstart.org/login');
  const tab = useMemo(() => tabFromSearch(search), [search]);
  const [currentUser, setCurrentUser] = useState<Sub2ApiUser | null | undefined>(undefined);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [favorites, setFavorites] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void fetchCurrentSub2ApiUser().then(setCurrentUser).catch(() => setCurrentUser(null));
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    setError('');
    const load = async () => {
      try {
        if (tab === 'posts') {
          const response = await sub2ApiFetch(`${apiBase}/mine/posts`, {headers: {Accept: 'application/json'}});
          if (!response.ok) throw new Error('读取我的帖子失败');
          const body = await response.json() as PageResponse<Post>;
          if (mounted) setPosts(body.items || []);
        } else if (tab === 'comments') {
          const response = await sub2ApiFetch(`${apiBase}/mine/comments`, {headers: {Accept: 'application/json'}});
          if (!response.ok) throw new Error('读取我的评论失败');
          const body = await response.json() as PageResponse<Comment>;
          if (mounted) setComments(body.items || []);
        } else {
          let ids: number[] = [];
          try { ids = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || '[]').map(Number).filter(Number.isFinite); } catch { ids = []; }
          const items = await Promise.all(ids.map(async (id) => {
            const response = await sub2ApiFetch(`${apiBase}/posts/${id}`, {headers: {Accept: 'application/json'}});
            return response.ok ? await response.json() as Post : null;
          }));
          if (mounted) setFavorites(items.filter((item): item is Post => Boolean(item)));
        }
      } catch (reason) {
        if (mounted) setError(reason instanceof Error ? reason.message : '读取数据失败');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => { mounted = false; };
  }, [apiBase, currentUser, tab]);

  const loginHref = buildSub2ApiLoginURL(
    loginURL,
    typeof window === 'undefined' ? `/community/mine/?tab=${tab}` : window.location.href,
  );
  const title = tab === 'posts' ? '我的帖子' : tab === 'comments' ? '我的评论' : '我的收藏';
  const emptyCopy = tab === 'posts' ? '你还没有发布过帖子。' : tab === 'comments' ? '你还没有发表过评论。' : '在帖子详情页收藏的内容会显示在这里。';

  return <Layout title={`${title} · HackStart`} description="HackStart 社区个人中心">
    <main className={styles.minePage}>
      <ResourceSidebar />
      <section className={styles.mineContent}><div className={styles.mineInner}>
        <header className={styles.mineHeader}><div><p>COMMUNITY ACCOUNT</p><h1>{title}</h1></div><Link to="/community/">返回社区</Link></header>
        <nav className={styles.mineTabs} aria-label="社区个人中心"><Link to="/community/mine/?tab=favorites" data-active={tab === 'favorites'}><Bookmark />我的收藏</Link><Link to="/community/mine/?tab=posts" data-active={tab === 'posts'}><FileText />我的帖子</Link><Link to="/community/mine/?tab=comments" data-active={tab === 'comments'}><MessageCircle />我的评论</Link></nav>
        {currentUser === undefined || loading ? <div className={styles.postState}><LoaderCircle className={styles.spin} /><span>正在读取</span></div> : !currentUser ? <div className={styles.mineEmpty}><strong>登录后查看个人内容</strong><a href={loginHref}>登录 HackStart</a></div> : error ? <div className={styles.mineEmpty}><strong>{error}</strong></div> : tab === 'comments' ? <div className={styles.mineList}>{comments.length === 0 ? <div className={styles.mineEmpty}><MessageCircle /><strong>{emptyCopy}</strong></div> : comments.map((item) => <article className={styles.mineComment} key={item.id}><Link to={`/community/post/?id=${item.post?.id || ''}`}>{item.post?.title || '社区帖子'}</Link><p>{item.content}</p><span>{formatDate(item.created_at)}</span></article>)}</div> : <div className={styles.mineList}>{(tab === 'posts' ? posts : favorites).length === 0 ? <div className={styles.mineEmpty}><Bookmark /><strong>{emptyCopy}</strong></div> : (tab === 'posts' ? posts : favorites).map((item) => <Link className={styles.mineItem} key={item.id} to={`/community/post/?id=${item.id}`}><div className={styles.mineItemTitle}><strong>{item.title}</strong><span>{formatDate(item.updated_at || item.created_at)}</span></div><div className={styles.mineItemMeta}><span>{item.topic?.name || '社区'}</span><span><MessageCircle />{item.comment_count}</span><span><Eye />{item.view_count}</span></div></Link>)}</div>}
      </div></section>
    </main>
  </Layout>;
}
