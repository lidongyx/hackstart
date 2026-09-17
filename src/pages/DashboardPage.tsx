import {ArrowUpRight, BookOpenText, CalendarDays, CheckCircle2, Crown, LoaderCircle, RefreshCw} from 'lucide-react';
import {useEffect, useState} from 'react';
import {getCourses, getMembership} from '../lib/api';
import type {Course, Membership, User} from '../lib/types';

type Props = {user: User; onNavigate: (path: string) => void};
const date = (value: string | null | undefined) => value ? new Date(value).toLocaleDateString('zh-CN', {year: 'numeric', month: 'long', day: 'numeric'}) : '尚未开通';

export default function DashboardPage({user, onNavigate}: Props) {
  const [membership, setMembership] = useState<Membership | null>(user.membership || null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true); setError('');
    try {
      const [membershipResult, coursesResult] = await Promise.all([getMembership(), getCourses()]);
      setMembership(membershipResult.membership); setCourses(coursesResult.items);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '暂时无法读取会员信息');
    } finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  const active = membership?.active === true;
  return <>
    <header className="page-header"><div><p className="eyebrow dark">MEMBER SPACE / OVERVIEW</p><h1>你好，{user.nickname || 'HackStart 用户'}</h1><p className="lead">这里是你的 HackStart 会员空间，课程权益和账号资料都在这里。</p></div><button className="secondary-button" onClick={() => void load()} disabled={loading}><RefreshCw size={15} className={loading ? 'spin' : ''} />刷新状态</button></header>
    {error && <div className="notice error-notice">{error}<button className="text-button" onClick={() => void load()}>重试</button></div>}
    <section className="overview-grid">
      <article className={`status-panel ${active ? 'status-active' : ''}`}><div className="panel-icon"><Crown size={21} /></div><div><p className="eyebrow dark">MEMBERSHIP STATUS</p><h2>{active ? '年度会员有效' : membership?.member ? '会员已到期' : '尚未开通会员'}</h2><p>{active ? `有效期至 ${date(membership?.expires_at)}` : '开通后即可阅读会员系列中的完整内容。'}</p></div><a className="panel-action" href="https://hackstart.org/membership/" rel="noreferrer">{active ? '查看权益' : '了解会员'}<ArrowUpRight size={15} /></a></article>
      <article className="info-panel"><div className="panel-icon neutral"><CalendarDays size={20} /></div><div><p className="eyebrow dark">ACCOUNT CREATED</p><h2>{date(user.created_at)}</h2><p>{user.email}</p></div><button className="panel-action" onClick={() => onNavigate('/profile')}>编辑资料<ArrowUpRight size={15} /></button></article>
    </section>
    <section className="section-heading"><div><p className="eyebrow dark">YOUR LIBRARY</p><h2>课程内容</h2></div><a href="https://hackstart.org/docs/" rel="noreferrer">浏览全部课程 <ArrowUpRight size={15} /></a></section>
    {loading ? <div className="loading-state"><LoaderCircle className="spin" size={19} />正在读取你的会员内容</div> : <div className="course-grid">{courses.filter((course) => course.access_mode === 'member').map((course) => <a className="course-card" href={`https://hackstart.org/docs/${course.docs_path}/intro/`} key={course.code} rel="noreferrer"><div className="course-cover">{course.cover_url ? <img src={course.cover_url} alt="" /> : <BookOpenText size={25} />}<span>{course.chapter_count} 个章节</span></div><div className="course-body"><span className="course-label"><CheckCircle2 size={13} />会员内容</span><h3>{course.title}</h3><p>{course.summary || '围绕真实项目整理的实践课程。'}</p><span className="course-link">进入课程 <ArrowUpRight size={15} /></span></div></a>)}{courses.filter((course) => course.access_mode === 'member').length === 0 && <div className="empty-state">课程目录正在整理中。</div>}</div>}
  </>;
}
