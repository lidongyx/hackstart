import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {ArrowRight, BookOpen, Layers3, LoaderCircle, Wrench} from 'lucide-react';

import {courseIntroPath, useHackstartCoursesState, type HackstartCourse} from '@site/src/lib/courses';
import styles from './courses.module.css';

const fallbackCategory = '其他课程';

function courseCategory(course: HackstartCourse): string {
  return course.category || course.group || course.nav_group || fallbackCategory;
}

function categoryKey(label: string): string {
  return label.toLowerCase().replace(/\s+/g, '-');
}

function categoryIcon(label: string) {
  if (/基础|工程|开发/.test(label)) return Layers3;
  if (/工具|方法|插件|技能/.test(label)) return Wrench;
  return BookOpen;
}

function CourseCard({course, index}: {course: HackstartCourse; index: number}): React.ReactNode {
  const Icon = categoryIcon(courseCategory(course));
  return <li className={styles.card}>
    <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
    <span className={styles.icon}><Icon aria-hidden="true" /></span>
    <div className={styles.body}>
      <small>{courseCategory(course)} · 系列课程</small>
      <h2>{course.title}</h2>
      <p>{course.summary || '按章节循序学习，查看完整目录后再开始你的学习路径。'}</p>
    </div>
    <span className={styles.access}>会员课程</span>
    <Link className={styles.action} to={courseIntroPath(course)}>查看目录<ArrowRight aria-hidden="true" /></Link>
  </li>;
}

export default function Home(): React.ReactNode {
  const {courses, status} = useHackstartCoursesState();
  const categories = useMemo(() => Array.from(new Set(courses.map(courseCategory))), [courses]);
  const [activeCategory, setActiveCategory] = useState('all');
  const visible = activeCategory === 'all' ? courses : courses.filter((course) => categoryKey(courseCategory(course)) === activeCategory);

  return <Layout title="HackStart 系列课程" description="浏览 HackStart 系列课程与小册目录，从公开目录开始学习。">
    <main className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div><p className={styles.eyebrow}>HACKSTART COURSE LIBRARY</p><h1>系列课程</h1><p>按课程类别浏览 HackStart 小册。目录对所有人开放，选择一个方向后再进入章节学习。</p></div>
          <span className={styles.headerMark}>LEARN<br />BY<br />DOING</span>
        </header>
        <div className={styles.tabs} role="tablist" aria-label="系列课程分类">
          <button type="button" className={activeCategory === 'all' ? styles.active : undefined} onClick={() => setActiveCategory('all')}>全部课程</button>
          {categories.map((category) => <button key={category} type="button" className={activeCategory === categoryKey(category) ? styles.active : undefined} onClick={() => setActiveCategory(categoryKey(category))}>{category}</button>)}
        </div>
        <div className={styles.listHeading}><h2>学习路径</h2><span>{status === 'loading' ? '正在同步课程目录' : `共 ${visible.length} 个系列`}</span></div>
        {status === 'loading' && courses.length === 0 ? <div className={styles.state}><LoaderCircle className={styles.spin} />正在读取系列课程</div> : <ol className={styles.list}>{visible.map((course, index) => <CourseCard key={course.code} course={course} index={index} />)}{status === 'error' && <li className={styles.state}>课程服务暂时不可用，当前显示本地课程目录。</li>}{!visible.length && <li className={styles.state}>暂时没有已发布的系列课程。</li>}</ol>}
      </div>
    </main>
  </Layout>;
}
