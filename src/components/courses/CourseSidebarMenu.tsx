import React, {useMemo, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {BookOpen, Layers3, Shapes, Wrench} from 'lucide-react';

import {bookCategoryGroups, bookCatalog} from '@site/src/lib/bookCatalog';
import {courseIntroPath, type HackstartCourse} from '@site/src/lib/courses';
import styles from './CourseSidebarMenu.module.css';

type CategoryKey = 'foundation' | 'creation' | 'interaction' | 'other';

type Props = {
  courses: readonly HackstartCourse[];
  pathname?: string;
};

function categoryKey(course: HackstartCourse): CategoryKey {
  const catalog = bookCatalog.find((book) => book.code === course.code || book.docsPath === course.docs_path);
  if (catalog) return catalog.categoryKey;
  const label = course.category || course.group || course.nav_group || '';
  if (/基础|工程|入门/.test(label)) return 'foundation';
  if (/创作|视频|图片/.test(label)) return 'creation';
  if (/互动|游戏|3D/.test(label)) return 'interaction';
  return 'other';
}

function categoryIcon(category: CategoryKey) {
  if (category === 'foundation') return Layers3;
  if (category === 'creation') return Shapes;
  if (category === 'interaction') return Wrench;
  return BookOpen;
}

function isActive(pathname: string | undefined, href: string) {
  if (!pathname) return false;
  const base = href.replace(/intro\/?$/, '');
  return pathname === href || pathname === href.replace(/\/$/, '') || pathname.startsWith(base);
}

export default function CourseSidebarMenu({courses, pathname}: Props): ReactNode {
  const groups = useMemo(() => {
    const result = bookCategoryGroups.map((group) => ({...group, courses: [] as HackstartCourse[]}));
    const other = {key: 'other' as const, label: '其他小册', courses: [] as HackstartCourse[]};
    for (const course of courses) {
      const group = result.find((item) => item.key === categoryKey(course));
      (group || other).courses.push(course);
    }
    return other.courses.length ? [...result, other] : result;
  }, [courses]);

  return <nav className={styles.menu} aria-label="系列课程分类">
    {groups.map((group) => {
      if (!group.courses.length) return null;
      const Icon = categoryIcon(group.key);
      return <section className={styles.group} data-group={group.key} key={group.key}>
        <h2 className={styles.groupTitle}>{group.label}</h2>
        <div className={styles.courseList}>
          {group.courses.map((course) => {
            const href = courseIntroPath(course);
            return <Link className={`${styles.course} ${isActive(pathname, href) ? styles.active : ''}`} key={course.code} to={href}>
              <span className={styles.icon}><Icon aria-hidden="true" /></span>
              <span>{course.title}</span>
            </Link>;
          })}
        </div>
      </section>;
    })}
  </nav>;
}
