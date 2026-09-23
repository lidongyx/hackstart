import React, {useEffect, useRef, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import {useLocation} from '@docusaurus/router';
import {useColorMode} from '@docusaurus/theme-common';
import {
  BookOpenText,
  Boxes,
  Cable,
  CodeXml,
  ChevronDown,
  Crown,
  MessagesSquare,
  Moon,
  Puzzle,
  Sun,
  Wrench,
  Bookmark,
  FileText,
  MessageCircle,
  UserRound,
} from 'lucide-react';

import {categories, type ResourceCategory} from '@site/src/lib/resources';
import {courseIntroPath, useHackstartCourses} from '@site/src/lib/courses';
import {fetchCurrentSub2ApiUser, getStoredSub2ApiUser, subscribeToSub2ApiAuth, type Sub2ApiUser} from '@site/src/lib/sub2api-auth';
import CommunityAvatar, {communityDisplayName} from '@site/src/components/community/CommunityAvatar';
import styles from './ResourceSidebar.module.css';

type Props = {
  readonly activeCategory?: ResourceCategory;
  readonly onCategorySelect?: (category: ResourceCategory) => void;
  readonly embedded?: boolean;
  readonly membershipMode?: boolean;
};

function isActiveSiteLink(pathname: string, href: string) {
  if (href === '/qrcode') return pathname === href || pathname === `${href}/`;
  const base = href.replace(/intro\/?$/, '');
  return pathname === href || pathname === href.replace(/\/$/, '') || pathname.startsWith(base);
}

export default function ResourceSidebar({activeCategory, onCategorySelect, embedded = false, membershipMode = false}: Props): ReactNode {
  const {colorMode, setColorMode} = useColorMode();
  const {pathname} = useLocation();
  const nextColorMode = colorMode === 'dark' ? 'light' : 'dark';
  const courses = useHackstartCourses();
  const [currentUser, setCurrentUser] = useState<Sub2ApiUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    const syncAuth = () => {
      void fetchCurrentSub2ApiUser()
        .then((user) => {
          if (!mounted) return;
          setCurrentUser(user || getStoredSub2ApiUser());
          setAuthReady(true);
        })
        .catch(() => {
          if (!mounted) return;
          setCurrentUser(getStoredSub2ApiUser());
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
    scrollRef.current?.scrollTo({top: 0});
  }, [pathname, authReady, Boolean(currentUser)]);

  useEffect(() => {
    if (!accountOpen) return undefined;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAccountOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [accountOpen]);

  const consoleHref = authReady && currentUser ? '/account/' : `/login/?redirect=${encodeURIComponent(typeof window === 'undefined' ? '/' : window.location.pathname + window.location.search)}`;
  const section = membershipMode || pathname.startsWith('/membership') || pathname.startsWith('/account') || pathname.startsWith('/profile')
    ? 'membership'
    : pathname.startsWith('/docs')
      ? 'courses'
      : pathname.startsWith('/workshop')
        ? 'workshop'
        : pathname.startsWith('/community')
          ? 'community'
          : 'resources';
  const sectionMeta = {
    resources: {label: '资源导航', subtitle: 'RESOURCE LIBRARY'},
    courses: {label: '系列课程', subtitle: 'MEMBER COURSES'},
    workshop: {label: 'Workshop', subtitle: 'PRACTICE LAB'},
    community: {label: '社区', subtitle: 'COMMUNITY'},
    membership: {label: '永久会员', subtitle: 'MEMBERSHIP'},
  }[section];

  const iconForCourse = (docsPath: string) => {
    if (docsPath === 'integration') return <Cable />;
    if (docsPath === 'usecase') return <Boxes />;
    if (docsPath === 'plugin-skill-handbook') return <BookOpenText />;
    return <Crown />;
  };

  return (
    <aside className={clsx(styles.sidebar, embedded && styles.embedded)}>
      <Link className={styles.brand} to="/" aria-label="HackStart 首页">
        <img src="/img/hackstart.jpeg" alt="" />
        <span>
          HackStart
          <small>{sectionMeta.subtitle}</small>
        </span>
      </Link>

      <div ref={scrollRef} className={styles.scroll}>
        {section === 'resources' && <>
          <p className={styles.label}>浏览资源</p>
          <nav aria-label="资源导航" className={styles.nav}>
            {categories.map((item) => <Link key={item.id} className={clsx(styles.item, activeCategory === item.id && styles.active)} to={`/?category=${item.id}`} onClick={(event) => {
              if (!onCategorySelect) return;
              event.preventDefault();
              onCategorySelect(item.id);
            }}>
              <span className={styles.icon} aria-hidden="true">{item.id === 'modeling' ? <CodeXml /> : <Puzzle />}</span>
              <span className={styles.copy}><strong>{item.label}</strong><small>{item.id === 'modeling' ? '案例、工作流与实践记录' : '可复用的技能与方法'}</small></span>
            </Link>)}
          </nav>
        </>}

        {section === 'courses' && <>
          <p className={styles.label}>会员课程</p>
          <nav aria-label="系列课程" className={styles.nav}>
            {courses.map((course) => {
              const href = courseIntroPath(course);
              return <Link className={clsx(styles.item, isActiveSiteLink(pathname, href) && styles.active)} key={course.code} to={href}>
                <span className={styles.icon} aria-hidden="true">{iconForCourse(course.docs_path)}</span>
                <span className={styles.copy}><strong>{course.title}</strong><small>会员专属课程</small></span>
              </Link>;
            })}
          </nav>
        </>}

        {section === 'workshop' && <>
          <p className={styles.label}>实践任务</p>
          <nav aria-label="Workshop" className={styles.nav}>
            <Link className={clsx(styles.item, pathname === '/workshop/' && styles.active)} to="/workshop/"><span className={styles.icon}><Wrench /></span><span className={styles.copy}><strong>Workshop 目录</strong><small>动手完成真实任务</small></span></Link>
            <Link className={clsx(styles.item, pathname.startsWith('/workshop/tasks') && styles.active)} to="/workshop/tasks/"><span className={styles.icon}><Wrench /></span><span className={styles.copy}><strong>我的任务</strong><small>继续未完成的练习</small></span></Link>
            <Link className={clsx(styles.item, pathname.startsWith('/workshop/results') && styles.active)} to="/workshop/results/"><span className={styles.icon}><BookOpenText /></span><span className={styles.copy}><strong>社区打卡</strong><small>看看大家的实践结果</small></span></Link>
          </nav>
        </>}

        {section === 'community' && <>
          <p className={styles.label}>社区空间</p>
          <nav aria-label="社区" className={styles.nav}>
            <Link className={clsx(styles.item, pathname === '/community/' && styles.active)} to="/community/"><span className={styles.icon}><MessagesSquare /></span><span className={styles.copy}><strong>技术交流</strong><small>分享问题与实践经验</small></span></Link>
            <Link className={clsx(styles.item, pathname.startsWith('/community/mine') && styles.active)} to="/community/mine/"><span className={styles.icon}><UserRound /></span><span className={styles.copy}><strong>我的社区</strong><small>查看我的帖子与收藏</small></span></Link>
          </nav>
        </>}

        {section === 'membership' && <>
          <p className={styles.label}>账户与会员</p>
          <nav aria-label="账户与会员" className={styles.nav}>
            <Link className={clsx(styles.item, pathname.startsWith('/membership') && styles.active)} to="/membership/"><span className={styles.icon}><Crown /></span><span className={styles.copy}><strong>年度会员服务</strong><small>开通并管理会员权益</small></span></Link>
            <Link className={clsx(styles.item, pathname.startsWith('/account') && styles.active)} to="/account/"><span className={styles.icon}><Crown /></span><span className={styles.copy}><strong>会员中心</strong><small>查看课程与有效期</small></span></Link>
            <Link className={clsx(styles.item, pathname.startsWith('/profile') && styles.active)} to="/profile/"><span className={styles.icon}><UserRound /></span><span className={styles.copy}><strong>个人资料</strong><small>管理昵称、头像与资料</small></span></Link>
          </nav>
        </>}
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.footerAction} onClick={() => setColorMode(nextColorMode)}>
          <span aria-hidden="true">{colorMode === 'dark' ? <Sun /> : <Moon />}</span>
          <span>{colorMode === 'dark' ? '切换亮色主题' : '切换暗色主题'}</span>
        </button>
        {authReady && currentUser ? <div className={styles.account} ref={accountRef}>
          <button type="button" className={styles.accountButton} aria-expanded={accountOpen} onClick={() => setAccountOpen((value) => !value)}>
            <CommunityAvatar className={styles.accountAvatar} user={currentUser} />
            <span className={styles.accountCopy}><strong>{communityDisplayName(currentUser)}</strong><small>{currentUser.email || '已登录'}</small></span>
            <ChevronDown className={styles.accountChevron} aria-hidden="true" />
          </button>
          {accountOpen && <div className={styles.accountMenu} role="menu">
            <div className={styles.accountMenuIdentity}><strong>{communityDisplayName(currentUser)}</strong><span>{currentUser.email || '—'}</span></div>
            <button type="button" role="menuitem" onClick={() => {setColorMode(nextColorMode); setAccountOpen(false);}}><span><span aria-hidden="true">{colorMode === 'dark' ? <Sun /> : <Moon />}</span>切换{colorMode === 'dark' ? '亮色' : '暗色'}主题</span></button>
            <Link role="menuitem" to={consoleHref} onClick={() => setAccountOpen(false)}><span><UserRound />账户中心</span></Link>
            <Link role="menuitem" to="/account/" onClick={() => setAccountOpen(false)}><span><Crown />会员中心</span></Link>
            <Link role="menuitem" to="/profile/" onClick={() => setAccountOpen(false)}><span><UserRound />个人资料</span></Link>
            <Link role="menuitem" to="/community/mine/?tab=favorites" onClick={() => setAccountOpen(false)}><span><Bookmark />我的收藏</span></Link>
            <Link role="menuitem" to="/community/mine/?tab=posts" onClick={() => setAccountOpen(false)}><span><FileText />我的帖子</span></Link>
            <Link role="menuitem" to="/community/mine/?tab=comments" onClick={() => setAccountOpen(false)}><span><MessageCircle />我的评论</span></Link>
          </div>}
        </div> : <Link className={styles.console} to={consoleHref}>
          <span>登录 / 注册</span><span aria-hidden="true">↗</span>
        </Link>}
      </div>
    </aside>
  );
}
