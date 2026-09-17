import React, {useMemo} from 'react';
import Link from '@docusaurus/Link';
import {ArrowUpRight} from 'lucide-react';
import {
  useDocsSidebar,
  useDocsVersion,
} from '@docusaurus/plugin-content-docs/client';
import type {
  PropSidebar,
  PropSidebarItem,
} from '@docusaurus/plugin-content-docs';

import {
  docLibrarySections,
  type DocLibrarySection,
} from '@site/src/lib/docLibrary';
import styles from './DocLibraryIndex.module.css';

type CatalogItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  group: string;
  section?: string;
};

function collectDocs(items: PropSidebar, introId: string, trail: string[] = []): CatalogItem[] {
  return items.flatMap((item: PropSidebarItem): CatalogItem[] => {
    if (item.type === 'category') {
      return collectDocs(item.items, introId, [...trail, item.label]);
    }

    if (item.type !== 'link' || !item.docId || item.docId === introId) {
      return [];
    }

    return [{
      id: item.docId,
      title: item.label,
      description: item.description || '',
      href: item.href,
      group: trail.at(-1) || '其他',
      section: trail.length > 1 ? trail[0] : undefined,
    }];
  });
}

export default function DocLibraryIndex({section}: {section: DocLibrarySection}): React.ReactNode {
  const sidebar = useDocsSidebar();
  const version = useDocsVersion();
  const config = docLibrarySections[section] || {title: sidebar?.name || section, description: ''};

  const items = useMemo(() => {
    const collected = collectDocs(sidebar?.items || [], `${section}/intro`);
    return collected.map((item) => ({
      ...item,
      title: version.docs[item.id]?.title || item.title,
      description: version.docs[item.id]?.description || item.description || '打开文章查看完整内容。',
    }));
  }, [section, sidebar?.items, version.docs]);

  const groupedItems = useMemo(() => {
    const groups = new Map<string, CatalogItem[]>();

    items.forEach((item) => {
      const groupItems = groups.get(item.group) || [];
      groupItems.push(item);
      groups.set(item.group, groupItems);
    });

    return Array.from(groups.entries());
  }, [items]);

  return (
    <div className={styles.catalog}>
      <header className={styles.header}>
        <p>HACKSTART KNOWLEDGE LIBRARY</p>
        <h1>{config.title}</h1>
        <span>{config.description}</span>
      </header>

      <div className={styles.toolbar}>
        <span>{items.length} 篇文章</span>
      </div>

      <section className={styles.groups} aria-live="polite">
        {groupedItems.map(([group, groupItems], groupIndex) => (
          <section className={styles.group} key={group}>
            <h2 className={styles.groupTitle}>{group}</h2>
            <div className={styles.groupList}>
              {groupItems.map((item, itemIndex) => {
                const index = groupedItems
                  .slice(0, groupIndex)
                  .reduce((total, [, previousItems]) => total + previousItems.length, 0) + itemIndex + 1;

                return (
                  <Link className={styles.card} to={item.href} key={item.id}>
                    <span className={styles.cardIndex} aria-hidden="true">{String(index).padStart(2, '0')}</span>
                    <div className={styles.cardBody}>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <span className={styles.cardArrow} aria-hidden="true"><ArrowUpRight /></span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </section>

      {items.length === 0 && <div className={styles.empty}>暂无文章</div>}
    </div>
  );
}
