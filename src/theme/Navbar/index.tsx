import React, {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {useColorMode} from '@docusaurus/theme-common';
import {ArrowUpRight, BookOpen, BookOpenCheck, Boxes, Crown, MessagesSquare, Moon, Sun, Wrench} from 'lucide-react';

import CommunityAvatar, {communityDisplayName} from '@site/src/components/community/CommunityAvatar';
import {fetchCurrentSub2ApiUser, getStoredSub2ApiUser, subscribeToSub2ApiAuth, type Sub2ApiUser} from '@site/src/lib/sub2api-auth';

const items = [
  {label: '系列课程', href: '/book/', icon: BookOpen, match: (path: string) => path === '/' || path === '/book/' || (path.startsWith('/docs/') && !path.startsWith('/docs/workshops/') && !['/docs/integration/', '/docs/usecase/', '/docs/plugin-skill-handbook/'].some((prefix) => path.startsWith(prefix)))},
  {label: 'API教程', href: '/docs/integration/intro/', icon: BookOpenCheck, match: (path: string) => ['/docs/integration/', '/docs/usecase/', '/docs/plugin-skill-handbook/'].some((prefix) => path.startsWith(prefix))},
  {label: 'Workshop', href: '/workshop/', icon: Wrench, match: (path: string) => path.startsWith('/workshop') || path.startsWith('/docs/workshops/')},
  {label: '资源导航', href: '/resources/?category=modeling', icon: Boxes, match: (path: string) => path.startsWith('/resources')},
  {label: '社区', href: '/community/', icon: MessagesSquare, match: (path: string) => path.startsWith('/community')},
  {label: '永久会员', href: '/membership/', icon: Crown, match: (path: string) => path.startsWith('/membership') || path.startsWith('/account') || path.startsWith('/profile')},
];

export default function Navbar(): React.ReactNode {
  const {pathname, search} = useLocation();
  const {colorMode, setColorMode} = useColorMode();
  const [user, setUser] = useState<Sub2ApiUser | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const initial = getStoredSub2ApiUser();
    if (initial) {
      setUser(initial);
      setAuthReady(true);
    }
    const sync = () => {
      const cached = getStoredSub2ApiUser();
      void fetchCurrentSub2ApiUser()
        .then((next) => {
          if (!mounted) return;
          setUser(next || cached);
          setAuthReady(true);
        })
        .catch(() => {
          if (!mounted) return;
          setUser(cached);
          setAuthReady(true);
        });
    };
    sync();
    const unsubscribe = subscribeToSub2ApiAuth(sync);
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const nextColorMode = colorMode === 'dark' ? 'light' : 'dark';
  const loginHref = `/login/?redirect=${encodeURIComponent(pathname + search)}`;

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
      <div className="hs-top-navbar__actions">
        <button
          type="button"
          className="hs-top-navbar__icon-btn"
          title={colorMode === 'dark' ? '切换亮色主题' : '切换暗色主题'}
          aria-label={colorMode === 'dark' ? '切换亮色主题' : '切换暗色主题'}
          onClick={() => setColorMode(nextColorMode)}>
          {colorMode === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </button>
        {authReady && (user ? (
          <Link className="hs-top-navbar__account" to="/account/" title="打开会员中心">
            <CommunityAvatar className="hs-top-navbar__account-avatar" user={user} />
            <span className="hs-top-navbar__account-name">{communityDisplayName(user)}</span>
          </Link>
        ) : (
          <Link className="hs-top-navbar__cta" to={loginHref}>
            <span>登录</span><ArrowUpRight aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  </header>;
}
