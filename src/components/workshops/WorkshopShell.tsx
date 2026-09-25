import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';

import {usePublicWorkshops, useWorkshopSelection, workshopDocsURL, type Workshop} from '@site/src/lib/workshops';
import styles from './workspace.module.css';

type Props = {children: ReactNode};

function workshopHref(item: Workshop, pathname: string) {
  if (pathname.startsWith('/workshop/tasks')) return `/workshop/tasks/?workshop=${encodeURIComponent(item.code)}`;
  if (pathname.startsWith('/workshop/results')) return `/workshop/results/?workshop=${encodeURIComponent(item.code)}`;
  return workshopDocsURL(item.docs_path);
}

function activeWorkshop(item: Workshop, pathname: string, selected: string) {
  if (selected) return item.code === selected;
  return pathname.startsWith(`/docs/workshops/${item.code}`);
}

export function WorkshopSidebar({embedded = false}: {embedded?: boolean}): ReactNode {
  const {pathname} = useLocation();
  const selected = useWorkshopSelection();
  const {items, status} = usePublicWorkshops();

  return <aside className={`${styles.sidebar} ${embedded ? styles.embedded : ""}`}>
      <div className={styles.sidebarHeader}><p>WORKSHOP</p><strong>实践工坊</strong></div>
      <div className={styles.sidebarScroll}>
        <p className={styles.sidebarLabel}>Workshop 列表</p>
        {status === 'loading' && <div className={styles.sidebarState}>正在读取</div>}
        {status !== 'loading' && items.map((item, index) => <Link key={item.code} to={workshopHref(item, pathname)} className={activeWorkshop(item, pathname, selected) ? styles.workshopActive : undefined}>
          <b>{String(item.position || index + 1).padStart(2, '0')}</b>
          <span><strong>{item.title}</strong><small>{item.category || '通用'} · {item.code}</small></span>
        </Link>)}
        {status === 'ready' && !items.length && <div className={styles.sidebarState}>暂无已发布 Workshop</div>}
      </div>
    </aside>;
}

export default function WorkshopShell({children}: Props): ReactNode {
  return <div className={styles.workspace}>
    <WorkshopSidebar />
    <main className={styles.content}>{children}</main>
  </div>;
}
