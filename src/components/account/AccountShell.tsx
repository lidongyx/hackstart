import React, {useEffect, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {LoaderCircle, LogOut} from 'lucide-react';
import ResourceSidebar from '@site/src/components/resources/ResourceSidebar';
import {getMe, logoutRemote} from '@site/src/lib/api';
import {getSub2ApiToken, subscribeToSub2ApiAuth} from '@site/src/lib/sub2api-auth';
import type {User} from '@site/src/lib/types';
import styles from './styles.module.css';

type Props = {title: string; children: (user: User, updateUser: (user: User) => void) => ReactNode};

export default function AccountShell({title, children}: Props): ReactNode {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  useEffect(() => {
    let active = true;
    const load = async (showSpinner = true) => {
      if (showSpinner) setLoading(true); setError('');
      try { const current = getSub2ApiToken() ? await getMe() : null; if (active) setUser(current); }
      catch (cause) { if (active) { setUser(null); setError(cause instanceof Error ? cause.message : '读取账户失败'); } }
      finally { if (active) setLoading(false); }
    };
    void load();
    const unsubscribe = subscribeToSub2ApiAuth(() => void load(false));
    return () => { active = false; unsubscribe(); };
  }, [revision]);
  const loginURL = `/login/?redirect=${encodeURIComponent(typeof window === 'undefined' ? '/account/' : window.location.pathname + window.location.search)}`;
  return <Layout title={title}><div className={styles.shell}>
    <ResourceSidebar membershipMode />
    <main className={styles.page}>
      <header className={styles.header}><h1>{title}</h1>{user && <button className={styles.secondary} disabled={loggingOut} onClick={async () => {
        setLoggingOut(true); await logoutRemote(); setUser(null); setLoggingOut(false);
      }}><LogOut size={16} />退出登录</button>}</header>
      <nav className={styles.tabs} aria-label="账户导航"><Link to="/account/">会员中心</Link><Link to="/profile/">个人资料</Link><Link to="/membership/">永久会员</Link></nav>
      {loading ? <div className={styles.state}><LoaderCircle className={styles.spin} />正在读取账户</div>
        : error ? <div className={styles.state} role="alert"><p>{error}</p><button className={styles.secondary} onClick={() => setRevision(value => value + 1)}>重试</button><Link to={loginURL}>重新登录</Link></div>
        : user ? children(user, setUser) : <div className={styles.state}><h2>登录 HackStart</h2><Link className={styles.primary} to={loginURL}>登录并继续</Link></div>}
    </main>
  </div></Layout>;
}
