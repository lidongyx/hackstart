import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {ArrowRight, Clock3, Code2, Gauge, LoaderCircle, RefreshCw} from 'lucide-react';

import WorkshopTabs from '@site/src/components/workshops/WorkshopTabs';
import {usePublicWorkshops, workshopDocsURL} from '@site/src/lib/workshops';
import styles from '@site/src/components/workshops/styles.module.css';

export default function WorkshopIndexPage(): React.ReactNode {
  const {items, status, retry} = usePublicWorkshops();
  return <Layout title="Workshop" description="HackStart 面向办公与运营场景的 Codex 实践任务"><main className={styles.page}><WorkshopTabs /><header className={styles.hero}><div><p className={styles.eyebrow}>HACKSTART WORKSHOP</p><h1>把 Codex 用进真实工作。</h1><p>每个 Workshop 都是一项可以完成、验证、复盘的真实任务，覆盖办公、外贸、视频剪辑、内容运营与个人工作流。</p></div><aside className={styles.heroAside}>完成任务后提交打卡，成果会直接出现在 HackStart 社区，方便复盘，也方便看到别人如何解决相似问题。</aside></header>{status === 'loading' && <section className={styles.state}><LoaderCircle className={styles.spin}/><span>正在读取 Workshop 列表</span></section>}{status === 'error' && <section className={styles.state}><RefreshCw/><strong>Workshop 列表暂时无法读取</strong><button type="button" onClick={retry}>重新加载</button></section>}{status === 'ready' && <ol className={styles.list}>{items.map((item, index) => <li key={item.code}><Link className={styles.card} to={workshopDocsURL(item.docs_path)}><span className={styles.number}>{String(item.position || index + 1).padStart(2, '0')}</span><div className={styles.cover}>{item.cover_url ? <img src={item.cover_url} alt=""/> : <Code2/>}</div><div className={styles.copy}><small>{item.category || '通用'} · Workshop {String(item.position || index + 1).padStart(2, '0')}</small><h2>{item.title}</h2><p>{item.summary || '打开任务说明，开始一次完整实践。'}</p><div className={styles.meta}><span><Gauge/>{item.difficulty || '入门'} · 难度 {item.difficulty_score || 1}/5</span><span><Clock3/>约 {item.estimated_minutes || 60} 分钟</span></div></div><ArrowRight className={styles.cardArrow}/></Link></li>)}{!items.length && <li className={styles.empty}>暂时没有已发布的 Workshop。</li>}</ol>}</main></Layout>;
}
