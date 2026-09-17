import React, {useEffect, useRef, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {useColorMode} from '@docusaurus/theme-common';
import {ColorModeProvider} from '@docusaurus/theme-common/internal';
import {
  Bookmark,
  BookOpenText,
  Cable,
  ClipboardCheck,
  Crown,
  FileText,
  Home,
  MessageCircle,
  MessagesSquare,
  Moon,
  Puzzle,
  Sun,
  UserRound,
  UsersRound,
  Wrench,
} from 'lucide-react';
import clsx from 'clsx';

import {courseIntroPath, useHackstartCourses} from '@site/src/lib/courses';
import {buildSub2ApiLoginURL, fetchCurrentSub2ApiUser, subscribeToSub2ApiAuth, type Sub2ApiUser} from '@site/src/lib/sub2api-auth';
import CommunityAvatar, {communityDisplayName} from '@site/src/components/community/CommunityAvatar';

type MenuKey = 'home' | 'workshop' | 'docs' | 'community' | 'account';

type MenuItem = {
  readonly label: string;
  readonly href: string;
  readonly icon: ReactNode;
  readonly external?: boolean;
};

function normalizePath(pathname: string) {
  return pathname === '/' ? pathname : pathname.replace(/\/$/, '');
}

function courseIcon(docsPath: string) {
  if (docsPath === 'integration') return <Cable />;
  if (docsPath === 'usecase') return <Puzzle />;
  return <BookOpenText />;
}

function MobileBottomNavContent(): ReactNode {
  const {pathname, search} = useLocation();
  const {colorMode, setColorMode} = useColorMode();
  const normalizedPath = normalizePath(pathname);
  const courses = useHackstartCourses();
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [currentUser, setCurrentUser] = useState<Sub2ApiUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const nextColorMode = colorMode === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    let mounted = true;
    const syncAuth = () => {
      void fetchCurrentSub2ApiUser()
        .then((user) => {
          if (!mounted) return;
          setCurrentUser(user);
          setAuthReady(true);
        })
        .catch(() => {
          if (!mounted) return;
          setCurrentUser(null);
          setAuthReady(true);
        });
    };

    syncAuth();
    const unsubscribe = subscribeToSub2ApiAuth(syncAuth);
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!openMenu) return undefined;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [openMenu]);

  useEffect(() => {
    setOpenMenu(null);
  }, [pathname, search]);

  const communityItems: MenuItem[] = [
    {label: '技术交流', href: '/community/', icon: <MessagesSquare />},
  ];
  const docsItems: MenuItem[] = courses.filter((course) => course.access_mode === 'public').map((course) => ({
    label: course.title,
    href: courseIntroPath(course),
    icon: courseIcon(course.docs_path),
  }));
  const workshopItems: MenuItem[] = [
    {label: 'Workshop 目录', href: '/workshop/', icon: <Wrench />},
    {label: '我的任务', href: '/workshop/tasks/', icon: <ClipboardCheck />},
    {label: '社区打卡', href: '/workshop/results/', icon: <UsersRound />},
  ];

  const activeMenu = (menu: MenuKey) => {
    if (menu === 'home') return normalizedPath === '/';
    if (menu === 'workshop') return normalizedPath.startsWith('/workshop');
    if (menu === 'docs') return normalizedPath.startsWith('/docs');
    if (menu === 'community') return normalizedPath.startsWith('/community');
    return normalizedPath.startsWith('/profile') || normalizedPath.startsWith('/account');
  };

  const homeItems: MenuItem[] = [
    {label: '回到首页', href: '/', icon: <Home />},
    {label: '年度会员', href: '/membership/', icon: <Crown />},
  ];
  const memberDocItems: MenuItem[] = courses.filter((course) => course.access_mode === 'member').map((course) => ({label: course.title, href: courseIntroPath(course), icon: <Crown />}));
  const menuItems = openMenu === 'home'
    ? homeItems
    : openMenu === 'workshop'
      ? workshopItems
      : openMenu === 'docs'
        ? [...docsItems, ...memberDocItems]
        : openMenu === 'community'
          ? communityItems
          : [];

  const consolePath = authReady && currentUser
    ? currentUser.role === 'admin' ? '/admin/dashboard' : '/dashboard'
    : '/login';
  const consoleHref = authReady && currentUser
    ? `https://hackstart.org${consolePath}`
    : buildSub2ApiLoginURL(
      'https://hackstart.org/login',
      typeof window === 'undefined' ? 'https://i.hackstart.org/' : window.location.href,
    );

  const closeMenu = () => setOpenMenu(null);
  const toggleMenu = (menu: MenuKey) => setOpenMenu((value) => value === menu ? null : menu);

  const renderMenuItems = (items: MenuItem[]) => (
    <div className="hs-mobile-bottom-nav__menu-list">
      {items.map((item) => (
        <Link
          key={item.label}
          className="hs-mobile-bottom-nav__menu-item"
          {...(item.external ? {href: item.href} : {to: item.href})}
          onClick={closeMenu}>
          <span className="hs-mobile-bottom-nav__menu-icon" aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="hs-mobile-bottom-nav-shell" ref={rootRef}>
      {openMenu && (
        <div
          id="hs-mobile-bottom-nav-menu"
          className={clsx('hs-mobile-bottom-nav__panel', openMenu === 'account' && 'hs-mobile-bottom-nav__panel--account')}
          role="dialog"
          aria-label={openMenu === 'account' ? '我的菜单' : openMenu === 'home' ? '首页菜单' : openMenu === 'workshop' ? 'Workshop 菜单' : openMenu === 'community' ? '社区菜单' : '文档菜单'}>
          {openMenu === 'account' ? (
            <div className="hs-mobile-bottom-nav__account-menu">
              <div className="hs-mobile-bottom-nav__account-identity">
                {currentUser ? (
                  <>
                    <CommunityAvatar className="hs-mobile-bottom-nav__account-avatar" user={currentUser} />
                    <span>
                      <strong>{communityDisplayName(currentUser)}</strong>
                      <small>{currentUser.email || '已登录'}</small>
                    </span>
                  </>
                ) : (
                  <span>
                    <strong>我的 HackStart</strong>
                    <small>登录后管理个人内容</small>
                  </span>
                )}
              </div>
              <button type="button" className="hs-mobile-bottom-nav__menu-item" onClick={() => {setColorMode(nextColorMode); closeMenu();}}>
                <span className="hs-mobile-bottom-nav__menu-icon" aria-hidden="true">{colorMode === 'dark' ? <Sun /> : <Moon />}</span>
                <span>切换{colorMode === 'dark' ? '亮色' : '暗色'}主题</span>
              </button>
              <Link className="hs-mobile-bottom-nav__menu-item" href={consoleHref} onClick={closeMenu}>
                <span className="hs-mobile-bottom-nav__menu-icon" aria-hidden="true"><UserRound /></span>
                <span>{currentUser ? '打开账号控制台' : '登录 / 注册'}</span>
                <span className="hs-mobile-bottom-nav__external" aria-hidden="true">↗</span>
              </Link>
              {currentUser && (
                <>
              <Link className="hs-mobile-bottom-nav__menu-item" to="/account/" onClick={closeMenu}>
                    <span className="hs-mobile-bottom-nav__menu-icon" aria-hidden="true"><Crown /></span>
                    <span>会员中心</span>
                  </Link>
                  <Link className="hs-mobile-bottom-nav__menu-item" to="/profile/" onClick={closeMenu}>
                    <span className="hs-mobile-bottom-nav__menu-icon" aria-hidden="true"><UserRound /></span>
                    <span>个人资料</span>
                  </Link>
              <Link className="hs-mobile-bottom-nav__menu-item" to="/community/mine/?tab=favorites" onClick={closeMenu}>
                    <span className="hs-mobile-bottom-nav__menu-icon" aria-hidden="true"><Bookmark /></span>
                    <span>我的收藏</span>
                  </Link>
                  <Link className="hs-mobile-bottom-nav__menu-item" to="/community/mine/?tab=posts" onClick={closeMenu}>
                    <span className="hs-mobile-bottom-nav__menu-icon" aria-hidden="true"><FileText /></span>
                    <span>我的帖子</span>
                  </Link>
                  <Link className="hs-mobile-bottom-nav__menu-item" to="/community/mine/?tab=comments" onClick={closeMenu}>
                    <span className="hs-mobile-bottom-nav__menu-icon" aria-hidden="true"><MessageCircle /></span>
                    <span>我的评论</span>
                  </Link>
                </>
              )}
            </div>
          ) : renderMenuItems(menuItems)}
        </div>
      )}

      <nav className="hs-mobile-bottom-nav" aria-label="移动端底部导航">
        {([
          {key: 'home' as const, label: '首页', icon: <Home aria-hidden="true" />},
          {key: 'workshop' as const, label: '工坊', icon: <Wrench aria-hidden="true" />},
          {key: 'docs' as const, label: '文档', icon: <BookOpenText aria-hidden="true" />},
          {key: 'community' as const, label: '社区', icon: <MessagesSquare aria-hidden="true" />},
          {key: 'account' as const, label: '我的', icon: <UserRound aria-hidden="true" />},
        ]).map((item) => {
          const active = activeMenu(item.key);
          const expanded = openMenu === item.key;
          return (
            <button
              key={item.key}
              type="button"
              className={clsx('hs-mobile-bottom-nav__item', active && 'hs-mobile-bottom-nav__item--active', expanded && 'hs-mobile-bottom-nav__item--expanded')}
              aria-current={active ? 'page' : undefined}
              aria-expanded={expanded}
              aria-controls="hs-mobile-bottom-nav-menu"
              onClick={() => toggleMenu(item.key)}>
              <span className="hs-mobile-bottom-nav__icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default function MobileBottomNav(): ReactNode {
  return (
    <ColorModeProvider>
      <MobileBottomNavContent />
    </ColorModeProvider>
  );
}
