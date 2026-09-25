import {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, LockKeyhole, LogIn, RefreshCw, UsersRound} from 'lucide-react';

import {getSub2ApiToken} from '@site/src/lib/sub2api-auth';
import {fetchHackstartWorkshopResults, useWorkshopApi, useWorkshopSelection, type WorkshopResult} from '@site/src/lib/workshops';
import PrivateWorkshopImage from '@site/src/components/workshops/PrivateWorkshopImage';
import WorkshopTabs from '@site/src/components/workshops/WorkshopTabs';
import styles from '@site/src/components/workshops/styles.module.css';
import WorkshopShell from '@site/src/components/workshops/WorkshopShell';

export default function WorkshopResultsPage(): React.ReactNode {
  const {apiBase, hackadminBase} = useWorkshopApi();
  const selected = useWorkshopSelection();
  const [items, setItems] = useState<WorkshopResult[]>([]);
  const [pagination, setPagination] = useState({page: 1, pages: 1, total: 0});
  const [state, setState] = useState<'loading' | 'anonymous' | 'forbidden' | 'ready' | 'error'>('loading');
  const [lightbox, setLightbox] = useState('');
  const load = async (page = 1) => {
    setState('loading');
    if (!getSub2ApiToken()) {setState('anonymous'); return;}
    try { const result = await fetchHackstartWorkshopResults(apiBase, {workshop: selected, page}); setItems(result.items || []); setPagination(result.pagination || {page, pages: 1, total: 0}); setState('ready'); }
    catch (cause) { const status = (cause as Error & {status?: number}).status; setState(status === 401 ? 'anonymous' : status === 403 ? 'forbidden' : 'error'); }
  };
  useEffect(() => { void load(); }, [apiBase, selected]);
  const loginHref = `/login/?redirect=${encodeURIComponent(typeof window === 'undefined' ? '/workshop/results/' : window.location.pathname + window.location.search)}`;
  return <Layout title="社区打卡" description="查看 HackStart Workshop 实践成果"><WorkshopShell><main className={styles.page}><WorkshopTabs/>{state === 'loading' && <section className={styles.state}><LoaderCircle className={styles.spin}/><span>正在读取社区打卡</span></section>}{state === 'anonymous' && <section className={styles.state}><LogIn/><strong>登录后查看社区打卡</strong><Link to={loginHref}>登录 / 注册</Link></section>}{state === 'forbidden' && <section className={styles.state}><LockKeyhole/><strong>需要 HackStart 永久会员</strong><Link to="/membership/">了解永久会员</Link></section>}{state === 'error' && <section className={styles.state}><RefreshCw/><strong>社区打卡暂时无法读取</strong><button type="button" onClick={() => void load()}>重新加载</button></section>}{state === 'ready' && <><div className={styles.resultToolbar}><span>{selected ? `当前 Workshop：${selected}` : '全部 Workshop'}</span><span>{pagination.total} 条打卡</span></div><section className={styles.feed}>{items.map((item) => <article className={styles.entry} key={item.id}><header><span className={styles.avatar}>{item.user.avatar_url ? <img src={item.user.avatar_url} alt=""/> : (item.user.nickname || 'U').slice(0, 1).toUpperCase()}</span><div><strong>{item.user.nickname || '未设置昵称'}</strong><small>{item.workshop.category || '通用'} · {item.workshop.title} · {new Date(item.updated_at).toLocaleString('zh-CN', {hour12: false})}</small></div><b><CheckCircle2/>已完成</b></header><div className={styles.entryBody}><small>{item.workshop.code}</small><p>{item.content}</p>{item.screenshots.length > 0 && <div className={styles.resultImages}>{item.screenshots.map((src) => <PrivateWorkshopImage key={src} hackadminBase={hackadminBase} src={src} alt={`${item.workshop.title}成果`} onOpen={setLightbox}/>)}</div>}</div></article>)}{!items.length && <div className={styles.state}><UsersRound/><strong>还没有社区打卡</strong><span>完成一个 Workshop 后，你的成果会出现在这里。</span><Link to={`/workshop/tasks/${selected ? `?workshop=${encodeURIComponent(selected)}` : ''}`}>去完成任务<ArrowRight/></Link></div>}</section><footer className={styles.pagination}><button type="button" disabled={pagination.page <= 1} onClick={() => void load(pagination.page - 1)}><ArrowLeft/>上一页</button><span>第 {pagination.page} / {Math.max(1, pagination.pages)} 页</span><button type="button" disabled={pagination.page >= pagination.pages} onClick={() => void load(pagination.page + 1)}>下一页<ArrowRight/></button></footer></>}</main>{lightbox && <div className={styles.lightbox} onClick={() => setLightbox('')}><button type="button" aria-label="关闭" onClick={() => setLightbox('')}>×</button><img src={lightbox} alt="Workshop 成果大图"/></div>}</WorkshopShell></Layout>;
}
