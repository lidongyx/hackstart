import {useEffect, useState} from 'react';
import Layout from './components/Layout';
import {clearToken, consumeAuthTokenFromFragment, getToken, subscribeToAuth} from './lib/auth';
import {getMe, logoutRemote} from './lib/api';
import type {User} from './lib/types';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const [path, setPath] = useState(window.location.pathname === '/profile' ? '/profile' : '/');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    setLoading(true);
    if (!getToken()) { setUser(null); setLoading(false); return; }
    try { setUser(await getMe()); }
    catch { clearToken(); setUser(null); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    consumeAuthTokenFromFragment();
    const handlePopState = () => setPath(window.location.pathname === '/profile' ? '/profile' : '/');
    window.addEventListener('popstate', handlePopState);
    void loadUser();
    const unsubscribe = subscribeToAuth(() => void loadUser());
    return () => { window.removeEventListener('popstate', handlePopState); unsubscribe(); };
  }, []);
  useEffect(() => { document.title = path === '/profile' ? '个人资料 · HackStart' : '会员中心 · HackStart'; }, [path]);

  function navigate(next: string) { window.history.pushState({}, '', next); setPath(next); }
  async function logout() { await logoutRemote().catch(() => undefined); clearToken(); setUser(null); navigate('/'); }

  if (loading) return <div className="boot-screen"><div className="boot-mark"><img src="/hackstart-mark.png" alt="" /></div><span>正在准备会员空间</span></div>;
  if (!user) return <LoginPage />;
  return <Layout user={user} path={path} onNavigate={navigate} onLogout={() => void logout()}>{path === '/profile' ? <ProfilePage user={user} onUserChange={setUser} /> : <DashboardPage user={user} onNavigate={navigate} />}</Layout>;
}
