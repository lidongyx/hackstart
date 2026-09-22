import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {ArrowRight, BookOpenText, CheckSquare2, Clock3, Code2, Gauge, LoaderCircle, RefreshCw} from 'lucide-react';

import WorkshopTabs from '@site/src/components/workshops/WorkshopTabs';
import WorkshopShell from '@site/src/components/workshops/WorkshopShell';
import {usePublicWorkshops, workshopDocsURL} from '@site/src/lib/workshops';
import styles from '@site/src/components/workshops/styles.module.css';

export default function WorkshopIndexPage(): React.ReactNode {
  const {items, status, retry} = usePublicWorkshops();
  return <Layout title="Workshop" description="HackStart 面向办公与运营场景的 Codex 实践任务"><WorkshopShell><main className={styles.page}><WorkshopTabs /><header className={styles.directoryHeader}><div><p className={styles.eyebrow}>WORKSHOP DIRECTORY</p><h1>工坊列表</h1></div><span>选择一个真实任务，查看说明并完成实践打卡。</span></header>{status === 'loading' && <section className={styles.state}><LoaderCircle className={styles.spin}/><span>正在读取 Workshop 列表</span></section>}{status === 'error' && <section className={styles.state}><RefreshCw/><strong>Workshop 列表暂时无法读取</strong><button type="button" onClick={retry}>重新加载</button></section>}{status === 'ready' && <ol className={styles.list}>{items.map((item, index) => <li key={item.code}><article className={styles.card} style={{'--workshop-accent': ['#4f46e5', '#2f9f82', '#ea6517', '#d72b72'][index % 4]} as React.CSSProperties}><span className={styles.number}>{String(item.position || index + 1).padStart(2, '0')}</span><div className={styles.cover}>{item.cover_url ? <img src={item.cover_url} alt=""/> : <Code2/>}</div><div className={styles.copy}><small>{item.category || '通用'} · Workshop {String(item.position || index + 1).padStart(2, '0')}</small><h2>{item.title}</h2><p>{item.summary || '打开任务说明，开始一次完整实践。'}</p><div className={styles.meta}><span><Gauge/>{item.difficulty || '入门'} · 难度 {item.difficulty_score || 1}/5</span><span><Clock3/>约 {item.estimated_minutes || 60} 分钟</span></div></div><div className={styles.cardActions}><Link className={styles.primaryAction} to={workshopDocsURL(item.docs_path)}><BookOpenText/>查看 Workshop<ArrowRight/></Link><Link className={styles.secondaryAction} to={`/workshop/tasks/?workshop=${encodeURIComponent(item.code)}`}><CheckSquare2/>查看任务</Link></div></article></li>)}{!items.length && <li className={styles.empty}>暂时没有已发布的 Workshop。</li>}</ol>}</main></WorkshopShell></Layout>;
}
