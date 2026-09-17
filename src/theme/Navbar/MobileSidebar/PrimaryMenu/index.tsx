import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {useColorMode} from '@docusaurus/theme-common';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import {categories} from '@site/src/lib/resources';
import {courseIntroPath, useHackstartCourses} from '@site/src/lib/courses';

type MobileNavItem = {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
};

function normalizePath(path: string) {
  return path.endsWith('/') ? path : `${path}/`;
}

function MobileMenuLink({item}: {readonly item: MobileNavItem}) {
  const {pathname} = useLocation();
  const mobileSidebar = useNavbarMobileSidebar();
  const isActive = normalizePath(pathname) === normalizePath(item.href);

  return (
    <li className="menu__list-item">
      <Link
        className={clsx('menu__link', isActive && 'menu__link--active')}
        {...(item.external ? {href: item.href} : {to: item.href})}
        onClick={() => mobileSidebar.toggle()}>
        {item.label}
      </Link>
    </li>
  );
}

export default function NavbarMobilePrimaryMenu(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const {colorMode, setColorMode} = useColorMode();
  const nextColorMode = colorMode === 'dark' ? 'light' : 'dark';
  const courses = useHackstartCourses();
  const resourceItems = categories.map((item) => ({label: item.label, href: `/?category=${item.id}`}));
  const courseItems = courses.map((course) => ({label: course.title, href: courseIntroPath(course)}));

  return (
    <nav className="hs-mobile-docs-panel" aria-label="站点菜单">
      <div className="hs-mobile-docs-title">资源导航</div>
      <ul className="menu__list hs-mobile-docs-menu">
        {resourceItems.map((item) => (
          <MobileMenuLink key={item.href} item={item} />
        ))}
      </ul>
      <div className="hs-mobile-docs-title">社区</div>
      <ul className="menu__list hs-mobile-docs-menu">
        <MobileMenuLink item={{label: '技术交流', href: '/community/'}} />
      </ul>
      <div className="hs-mobile-docs-title">系列课程</div>
      <ul className="menu__list hs-mobile-docs-menu">
        {courseItems.map((item) => <MobileMenuLink key={item.href} item={item} />)}
      </ul>
      <div className="hs-mobile-docs-footer">
        <button type="button" className="hs-mobile-docs-theme-toggle" onClick={() => setColorMode(nextColorMode)}>
          <span aria-hidden="true">{colorMode === 'dark' ? '☼' : '◐'}</span>
          {colorMode === 'dark' ? '切换亮色主题' : '切换暗色主题'}
        </button>
        <Link className="hs-mobile-docs-console" href="https://hackstart.org/login" onClick={() => mobileSidebar.toggle()}>
          进入控制台 <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </nav>
  );
}
