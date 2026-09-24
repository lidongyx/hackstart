import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {ArrowRight, BookOpen, CodeXml, Layers3, LoaderCircle, Shapes, Wrench} from 'lucide-react';

import {bookCategoryGroups, bookCatalog} from '@site/src/lib/bookCatalog';
import {courseIntroPath, useHackstartCoursesState, type HackstartCourse} from '@site/src/lib/courses';
import styles from './courses.module.css';

const fallbackCategory = '其他课程';
type CategoryKey = 'all' | 'foundation' | 'creation' | 'interaction';

function courseCategory(course: HackstartCourse): string {
  return course.category || course.group || course.nav_group || fallbackCategory;
}

function courseCategoryKey(course: HackstartCourse): Exclude<CategoryKey, 'all'> | 'other' {
  const catalog = bookCatalog.find((book) => book.code === course.code || book.docsPath === course.docs_path);
  if (catalog) return catalog.categoryKey;
  const label = courseCategory(course);
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

function CourseCard({course, index}: {course: HackstartCourse; index: number}): React.ReactNode {
  const courseGroup = courseCategoryKey(course);
  const Icon = categoryIcon(courseGroup === 'other' ? 'all' : courseGroup);
  const isPublic = course.access_mode === 'public';
  return <li className={styles.card}>
    <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
    <span className={styles.icon}><Icon aria-hidden="true" /></span>
    <div className={styles.body}>
      <small>{courseCategory(course)} · {isPublic ? '公开小册' : '会员课程'}</small>
      <h2>{course.title}</h2>
      <p>{course.summary || '按章节循序学习，查看完整目录后再开始你的学习路径。'}</p>
    </div>
    <span className={`${styles.access} ${isPublic ? styles.accessPublic : ''}`}>{isPublic ? '公开目录' : '会员课程'}</span>
    <Link className={styles.action} to={courseIntroPath(course)}>查看小册<ArrowRight aria-hidden="true" /></Link>
  </li>;
}

export default function Home(): React.ReactNode {
  const {courses, status} = useHackstartCoursesState();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const visible = useMemo(() => {
    if (activeCategory === 'all') return courses;
    if (activeCategory === 'creation') return courses.filter((course) => ['creation', 'interaction'].includes(courseCategoryKey(course)));
    return courses.filter((course) => courseCategoryKey(course) === activeCategory);
  }, [activeCategory, courses]);
  const counts = useMemo(() => bookCategoryGroups.map((group) => ({...group, count: courses.filter((course) => courseCategoryKey(course) === group.key).length})), [courses]);

  return <Layout title="HackStart 系列课程" description="浏览 HackStart 系列课程与小册目录，从公开目录开始学习。">
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar} aria-label="小册导航">
          <div className={styles.sidebarBrand}><span className={styles.sidebarLogo}><CodeXml /></span><div><strong>HackStart</strong><small>BOOK LIBRARY</small></div></div>
          <p className={styles.sidebarLabel}>浏览小册</p>
          <nav className={styles.sidebarNav}>
            <button type="button" className={activeCategory === 'all' ? styles.sidebarActive : ''} onClick={() => setActiveCategory('all')}><BookOpen /><span><strong>全部小册</strong><small>{courses.length} 个系列</small></span></button>
            {counts.map((group) => { const Icon = categoryIcon(group.key); return <button type="button" className={activeCategory === group.key ? styles.sidebarActive : ''} key={group.key} onClick={() => setActiveCategory(group.key)}><Icon /><span><strong>{group.label}</strong><small>{group.count} 个系列</small></span></button>; })}
          </nav>
          <div className={styles.sidebarNote}><span>LEARN BY DOING</span><p>每本小册都从目标、输入和交付结果出发。</p></div>
        </aside>

        <div className={styles.content}>
          <header className={styles.header}>
            <div><p className={styles.eyebrow}>HACKSTART COURSE LIBRARY</p><h1>Codex 小册</h1><p>把 Codex 放进真实工作流。按方向选择一本小册，从目录开始，逐章完成自己的实践路径。</p></div>
            <span className={styles.headerMark}>LEARN<br />BY<br />DOING</span>
          </header>
          <div className={styles.tabs} role="tablist" aria-label="系列课程分类">
            <button type="button" className={activeCategory === 'all' ? styles.active : undefined} onClick={() => setActiveCategory('all')}><CodeXml />技术小册</button>
            <button type="button" className={activeCategory === 'foundation' ? styles.active : undefined} onClick={() => setActiveCategory('foundation')}><Layers3 />入门基础</button>
            <button type="button" className={activeCategory === 'creation' || activeCategory === 'interaction' ? styles.active : undefined} onClick={() => setActiveCategory('creation')}><Wrench />创作与应用</button>
          </div>
          <div className={styles.listHeading}><h2>{activeCategory === 'all' ? '学习顺序' : bookCategoryGroups.find((group) => group.key === activeCategory)?.label || '学习路径'}</h2><span>{status === 'loading' ? '正在同步课程目录' : `共 ${visible.length} 个系列`}</span></div>
          {status === 'loading' && courses.length === 0 ? <div className={styles.state}><LoaderCircle className={styles.spin} />正在读取系列课程</div> : <ol className={styles.list}>{visible.map((course, index) => <CourseCard key={course.code} course={course} index={index} />)}{status === 'error' && <li className={styles.state}>课程服务暂时不可用，当前显示本地课程目录。</li>}{!visible.length && <li className={styles.state}>暂时没有已发布的系列课程。</li>}</ol>}
        </div>
      </div>
    </main>
  </Layout>;
}
