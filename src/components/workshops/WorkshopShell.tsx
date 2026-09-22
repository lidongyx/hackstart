import React, {useEffect, useRef, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {ChevronDown, CircleUserRound, LogIn, LogOut, UserRound, Wrench} from 'lucide-react';

import CommunityAvatar, {communityDisplayName} from '@site/src/components/community/CommunityAvatar';
import {fetchCurrentSub2ApiUser, subscribeToSub2ApiAuth, type Sub2ApiUser} from '@site/src/lib/sub2api-auth';
import {logoutRemote} from '@site/src/lib/api';
import {usePublicWorkshops, useWorkshopSelection, workshopDocsURL, type Workshop} from '@site/src/lib/workshops';
import styles from './workspace.module.css';

type Props = {children: ReactNode};

const primaryLinks = [
  {href: '/', label: '学习路径'},
  {href: '/workshop/', label: 'Workshop'},
  {href: '/?category=modeling', label: '资源'},
  {href: '/community/', label: '社区'},
  {href: '/membership/', label: '年度会员'},
];

function workshopHref(item: Workshop, pathname: string) {
  if (pathname.startsWith('/workshop/tasks')) return `/workshop/tasks/?workshop=${encodeURIComponent(item.code)}`;
  if (pathname.startsWith('/workshop/results')) return `/workshop/results/?workshop=${encodeURIComponent(item.code)}`;
  return workshopDocsURL(item.docs_path);
}

function activeWorkshop(item: Workshop, pathname: string, selected: string) {
  if (selected) return item.code === selected;
  return pathname.startsWith(`/docs/workshops/${item.code}`);
}

function AccountControl() {
  const {pathname} = useLocation();
  const [user, setUser] = useState<Sub2ApiUser | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    const sync = () => {
      void fetchCurrentSub2ApiUser()
        .then((value) => { if (mounted) { setUser(value); setReady(true); } })
        .catch(() => { if (mounted) { setUser(null); setReady(true); } });
    };
    sync();
    const unsubscribe = subscribeToSub2ApiAuth(sync);
    return () => { mounted = false; unsubscribe(); };
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const close = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  async function signOut() {
    setOpen(false);
    await logoutRemote();
    window.location.assign('/');
  }

  if (!ready) return <div className={styles.accountLoading} aria-hidden="true" />;

  return <div ref={rootRef} className={styles.account}>
    <button type="button" className={styles.accountTrigger} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
      {user ? <CommunityAvatar className={styles.accountAvatar} user={user} /> : <span className={styles.accountAvatar}><UserRound /></span>}
      <span className={styles.accountCopy}><strong>{user ? communityDisplayName(user) : '登录 / 注册'}</strong><small>{user?.email || '查看学习权限与进度'}</small></span>
      <ChevronDown className={styles.accountChevron} aria-hidden="true" />
    </button>
    {open && <div className={styles.accountMenu} role="menu">
      {user ? <>
        <div className={styles.accountIdentity}><CircleUserRound /><span><strong>{communityDisplayName(user)}</strong><small>{user.email || '已登录'}</small></span></div>
        <Link to="/profile/" role="menuitem" onClick={() => setOpen(false)}><UserRound />个人资料</Link>
        <Link to="/account/" role="menuitem" onClick={() => setOpen(false)}><Wrench />会员中心</Link>
        <button type="button" role="menuitem" onClick={() => void signOut()}><LogOut />退出登录</button>
      </> : <Link to={`/login/?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`} role="menuitem" onClick={() => setOpen(false)}><LogIn />登录 / 注册</Link>}
    </div>}
  </div>;
}

export default function WorkshopShell({children}: Props): ReactNode {
  const {pathname} = useLocation();
  const selected = useWorkshopSelection();
  const {items, status} = usePublicWorkshops();

  return <div className={styles.workspace}>
    <header className={styles.topbar}>
      <Link to="/" className={styles.brand} aria-label="HackStart 首页"><img src="/img/hackstart.jpeg" alt="" /><span>HackStart</span></Link>
      <nav className={styles.primaryNav} aria-label="主要导航">
        {primaryLinks.map((item) => <Link key={item.href} to={item.href} className={item.href === '/workshop/' ? styles.active : undefined}>{item.label}</Link>)}
      </nav>
      <div className={styles.topbarAccount}><AccountControl /></div>
    </header>
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}><p>WORKSHOP</p><strong>实践工坊</strong></div>
      <div className={styles.sidebarScroll}>
        <p className={styles.sidebarLabel}>Workshop 列表</p>
        {status === 'loading' && <div className={styles.sidebarState}>正在读取</div>}
        {status !== 'loading' && items.map((item, index) => <Link key={item.code} to={workshopHref(item, pathname)} className={activeWorkshop(item, pathname, selected) ? styles.workshopActive : undefined}>
          <b>{String(item.position || index + 1).padStart(2, '0')}</b>
          <span><strong>{item.title}</strong><small>{item.category || '通用'} · {item.code}</small></span>
        </Link>)}
        {status === 'ready' && !items.length && <div className={styles.sidebarState}>暂无已发布 Workshop</div>}
      </div>
    </aside>
    <main className={styles.content}>{children}</main>
  </div>;
}
