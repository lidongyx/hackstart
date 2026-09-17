import React from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {ClipboardCheck, LayoutGrid, PanelLeftOpen, UsersRound, X} from 'lucide-react';

import {usePublicWorkshops, useWorkshopSelection, workshopDocsURL} from '@site/src/lib/workshops';
import styles from './styles.module.css';

export default function WorkshopTabs(): React.ReactNode {
  const {pathname} = useLocation();
  const selected = useWorkshopSelection();
  const [open, setOpen] = React.useState(false);
  const {items} = usePublicWorkshops();
  const query = selected ? `?workshop=${encodeURIComponent(selected)}` : '';
  const tabs = [
    {href: '/workshop/', label: 'Workshop 目录', icon: LayoutGrid, active: pathname.startsWith('/workshop') && !pathname.startsWith('/workshop/tasks') && !pathname.startsWith('/workshop/results')},
    {href: `/workshop/tasks/${query}`, label: '我的任务', icon: ClipboardCheck, active: pathname.startsWith('/workshop/tasks')},
    {href: `/workshop/results/${query}`, label: '社区打卡', icon: UsersRound, active: pathname.startsWith('/workshop/results')},
  ];
  React.useEffect(() => setOpen(false), [pathname]);
  return <>
    <nav className={styles.tabs} aria-label="Workshop 功能"><span>实践空间</span>{tabs.map(({href, label, icon: Icon, active}) => <Link key={label} to={href} className={active ? styles.tabActive : undefined}><Icon aria-hidden="true" />{label}</Link>)}</nav>
    <button type="button" className={styles.contextToggle} aria-expanded={open} onClick={() => setOpen(true)}><PanelLeftOpen />切换 Workshop</button>
    {open && <div className={styles.contextBackdrop} onClick={() => setOpen(false)}><aside className={styles.contextDrawer} role="dialog" aria-modal="true" aria-label="Workshop 切换导航" onClick={(event) => event.stopPropagation()}><header><div><strong>切换 Workshop</strong><span>选择后进入内容、任务或社区打卡</span></div><button type="button" aria-label="关闭导航" onClick={() => setOpen(false)}><X /></button></header><div className={styles.contextList}>{items.map((item, index) => {const href = pathname.startsWith('/workshop/tasks') ? `/workshop/tasks/?workshop=${encodeURIComponent(item.code)}` : pathname.startsWith('/workshop/results') ? `/workshop/results/?workshop=${encodeURIComponent(item.code)}` : workshopDocsURL(item.docs_path); return <Link key={item.code} to={href} className={selected === item.code ? styles.contextActive : undefined} onClick={() => setOpen(false)}><b>{String(item.position || index + 1).padStart(2, '0')}</b><span><strong>{item.title}</strong><small>{item.category || '通用'} · {item.code}</small></span></Link>;})}</div></aside></div>}
  </>;
}
