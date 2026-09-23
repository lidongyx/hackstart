import React from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {BookOpen, Boxes, Crown, MessagesSquare, Wrench} from 'lucide-react';

const items = [
  {label: '系列课程', href: '/docs/codexstart/intro/', icon: BookOpen, match: (path: string) => path.startsWith('/docs/')},
  {label: 'Workshop', href: '/workshop/', icon: Wrench, match: (path: string) => path.startsWith('/workshop')},
  {label: '资源导航', href: '/?category=modeling', icon: Boxes, match: (path: string) => path === '/'},
  {label: '社区', href: '/community/', icon: MessagesSquare, match: (path: string) => path.startsWith('/community')},
  {label: '永久会员', href: '/membership/', icon: Crown, match: (path: string) => path.startsWith('/membership') || path.startsWith('/account') || path.startsWith('/profile')},
];

export default function Navbar(): React.ReactNode {
  const {pathname} = useLocation();
  return <header className="navbar hs-top-navbar">
    <div className="hs-top-navbar__inner">
      <Link className="hs-top-navbar__brand" to="/" aria-label="HackStart 首页">
        <img src="/img/hackstart.jpeg" alt="" />
        <span>HackStart<small>学习与实践</small></span>
      </Link>
      <nav className="hs-top-navbar__links" aria-label="主导航">
        {items.map(({label, href, icon: Icon, match}) => <Link key={label} className={`hs-top-navbar__link ${match(pathname) ? 'is-active' : ''}`} to={href} aria-current={match(pathname) ? 'page' : undefined}>
          <Icon aria-hidden="true" /><span>{label}</span>
        </Link>)}
      </nav>
      <Link className="hs-top-navbar__member" to="/membership/"><Crown aria-hidden="true" />永久会员</Link>
    </div>
  </header>;
}
