import React, {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import {ArrowUpRight, LoaderCircle} from 'lucide-react';
import AccountShell from '@site/src/components/account/AccountShell';
import styles from '@site/src/components/account/styles.module.css';
import {getCourses, getMembership} from '@site/src/lib/api';
import type {Course, MembershipResponse} from '@site/src/lib/types';

function Overview() {
  const [data, setData] = useState<MembershipResponse | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true; setLoading(true); setError('');
    void Promise.all([getMembership(), getCourses()]).then(([membership, catalog]) => {
      if (active) {setData(membership); setCourses(catalog.items);}
    }).catch(cause => {if (active) setError(cause instanceof Error ? cause.message : '读取会员内容失败');})
      .finally(() => {if (active) setLoading(false);});
    return () => {active = false;};
  }, [revision]);
  if (loading) return <div className={styles.state}><LoaderCircle className={styles.spin} />正在读取会员内容</div>;
  if (error) return <div className={styles.state} role="alert"><p>{error}</p><button className={styles.secondary} onClick={() => setRevision(value => value + 1)}>重试</button></div>;
  const membership = data?.membership;
  return <>
    <section className={styles.status}><div><h2>{membership?.active ? '永久会员有效' : membership?.member ? '会员已到期' : '尚未开通会员'}</h2><p>{membership?.expires_at ? `有效期至 ${new Date(membership.expires_at).toLocaleDateString('zh-CN')}` : 'HackStart 永久会员'}</p></div><Link className={styles.primary} to="/membership/">{membership?.active ? '查看权益' : '开通永久会员'}<ArrowUpRight size={16} /></Link></section>
    <h2 className={styles.sectionTitle}>会员课程</h2><div className={styles.courseList}>{courses.filter(course => course.access_mode === 'member').map(course => <Link className={styles.course} key={course.code} to={`/docs/${course.docs_path}/intro/`}>
      {course.cover_url && <img src={course.cover_url} alt="" />}<div className={styles.courseCopy}><h3>{course.title}</h3><p>{course.summary || `${course.chapter_count} 个章节`}</p></div><ArrowUpRight size={18} />
    </Link>)}</div>{!courses.some(course => course.access_mode === 'member') && <p className={styles.notice}>暂无已上架的会员课程。</p>}<Link to="/docs/">全部文档</Link>
  </>;
}

export default function AccountPage() {
  return <AccountShell title="会员中心">{() => <Overview />}</AccountShell>;
}
