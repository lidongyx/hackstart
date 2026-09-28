import React, {useEffect, useRef, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {ChevronDown, CircleUserRound, LogIn, LogOut, UserRound, Wrench} from 'lucide-react';

import CommunityAvatar, {communityDisplayName} from '@site/src/components/community/CommunityAvatar';
import {fetchCurrentSub2ApiUser, getStoredSub2ApiUser, subscribeToSub2ApiAuth, type Sub2ApiUser} from '@site/src/lib/sub2api-auth';
import {logoutRemote} from '@site/src/lib/api';
import styles from './SidebarAccount.module.css';

export default function SidebarAccount() {
  const {pathname, search} = useLocation();
  const [user, setUser] = useState<Sub2ApiUser | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    const initialUser = getStoredSub2ApiUser();
    if (initialUser) {
      setUser(initialUser);
      setReady(true);
    }
    const sync = () => {
      const cachedUser = getStoredSub2ApiUser();
      void fetchCurrentSub2ApiUser()
        .then((value) => {
          if (mounted) {
            setUser(value || cachedUser);
            setReady(true);
          }
        })
        .catch(() => {
          if (mounted) {
            // A cached login is still usable by the authenticated API calls;
            // keep the account UI stable when the profile check is transiently
            // unavailable.
            setUser(cachedUser);
            setReady(true);
          }
        });
    };
    sync();
    const unsubscribe = subscribeToSub2ApiAuth(sync);
    return () => { mounted = false; unsubscribe(); };
  }, []);

  useEffect(() => { setOpen(false); }, [pathname, search]);
  useEffect(() => {
    if (!open) return undefined;
    const close = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); rootRef.current?.querySelector('button')?.focus(); } };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape); };
  }, [open]);

  async function signOut() {
    setOpen(false);
    await logoutRemote();
    window.location.assign('/');
  }

  if (!ready) return <div className={styles.accountLoading} aria-hidden="true" />;

  return <div ref={rootRef} className={styles.account}>
    <button type="button" className={styles.accountTrigger} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
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
      </> : <Link to={`/login/?redirect=${encodeURIComponent(pathname + search)}`} role="menuitem" onClick={() => setOpen(false)}><LogIn />登录 / 注册</Link>}
    </div>}
  </div>;
}

