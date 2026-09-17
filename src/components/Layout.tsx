import {BookOpenText, ExternalLink, Home, LogOut, Settings2, UserRound} from 'lucide-react';
import type {ReactNode} from 'react';
import Avatar from './Avatar';
import type {User} from '../lib/types';

type Props = {user: User; path: string; onNavigate: (path: string) => void; onLogout: () => void; children: ReactNode};

export default function Layout({user, path, onNavigate, onLogout, children}: Props) {
  const nav = [
    {path: '/', label: '会员概览', icon: Home},
    {path: '/profile', label: '个人资料', icon: UserRound},
  ];
  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="https://hackstart.org/" rel="noreferrer">
        <img src="/hackstart.jpeg" alt="" />
        <span><strong>HackStart</strong><small>MEMBER SPACE</small></span>
      </a>
      <div className="sidebar-content">
        <p className="eyebrow">ACCOUNT</p>
        <nav aria-label="会员中心导航">
          {nav.map(({path: target, label, icon: Icon}) => <button key={target} className={`nav-item ${path === target ? 'active' : ''}`} onClick={() => onNavigate(target)}><Icon size={17} /><span>{label}</span></button>)}
        </nav>
        <p className="eyebrow sidebar-label">EXPLORE</p>
        <a className="nav-item" href="https://hackstart.org/docs/codexstart/intro/" rel="noreferrer"><BookOpenText size={17} /><span>会员课程</span><ExternalLink size={13} /></a>
        <a className="nav-item" href="https://hackstart.org/community/" rel="noreferrer"><Settings2 size={17} /><span>社区交流</span><ExternalLink size={13} /></a>
      </div>
      <div className="sidebar-account">
        <Avatar user={user} />
        <div className="sidebar-account-copy"><strong>{user.nickname || 'HackStart 用户'}</strong><small>{user.email}</small></div>
        <button className="icon-button" title="退出登录" onClick={onLogout}><LogOut size={16} /></button>
      </div>
    </aside>
    <main className="main-content">{children}</main>
  </div>;
}
