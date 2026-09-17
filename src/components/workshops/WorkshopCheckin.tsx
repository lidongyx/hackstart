import {useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import {CheckCircle2, ImagePlus, LockKeyhole, LogIn, LoaderCircle, RefreshCw, Save, Trash2, Upload, Wrench} from 'lucide-react';

import {buildSub2ApiLoginURL, getSub2ApiToken} from '@site/src/lib/sub2api-auth';
import {deleteHackstartWorkshopScreenshot, fetchHackstartWorkshops, saveHackstartWorkshopSubmission, uploadHackstartWorkshopScreenshot, useWorkshopApi, useWorkshopSelection, type Workshop, type WorkshopTask} from '@site/src/lib/workshops';
import PrivateWorkshopImage from './PrivateWorkshopImage';
import WorkshopTabs from './WorkshopTabs';
import styles from './styles.module.css';

const STATUS_LABELS = {draft: '草稿', submitted: '已完成', approved: '已完成', changes_requested: '需修改'} as const;

function filenameFromURL(value: string) { return decodeURIComponent(String(value).split('/').pop() || ''); }

export default function WorkshopCheckin(): React.ReactNode {
  const {apiBase, hackadminBase} = useWorkshopApi();
  const selectedCode = useWorkshopSelection();
  const [items, setItems] = useState<Workshop[]>([]);
  const [state, setState] = useState<'loading' | 'anonymous' | 'forbidden' | 'ready' | 'error'>('loading');
  const [content, setContent] = useState('');
  const [completed, setCompleted] = useState(false);
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [lightbox, setLightbox] = useState('');
  const fileInput = useRef<HTMLInputElement | null>(null);

  const load = async (preserveContent = false) => {
    setState('loading'); setError('');
    if (!getSub2ApiToken()) {setState('anonymous'); return;}
    try {
      const result = await fetchHackstartWorkshops(apiBase);
      setItems(result.items || []);
      const selected = result.items.find((item) => item.code === selectedCode) || result.items[0];
      const task = selected?.tasks?.[0];
      if (!preserveContent) setContent(task?.submission?.content || '');
      setCompleted(Boolean(task?.submission?.completed));
      setState('ready');
    } catch (cause) {
      const status = (cause as Error & {status?: number}).status;
      setState(status === 401 ? 'anonymous' : status === 403 ? 'forbidden' : 'error');
    }
  };

  useEffect(() => { void load(); }, [apiBase, selectedCode]);
  const workshop = items.find((item) => item.code === selectedCode) || items[0];
  const task: WorkshopTask | undefined = workshop?.tasks?.[0];
  const submission = task?.submission;
  const loginHref = buildSub2ApiLoginURL('https://hackstart.org/login', typeof window === 'undefined' ? '/workshop/tasks/' : window.location.href);

  async function save() {
    if (!task) return;
    if (completed && (content.trim().length < 20 || !submission?.screenshots?.length)) {setError('提交打卡前需要至少上传一张图片，文字记录不少于 20 个字'); return;}
    setBusy('save'); setError(''); setNotice('');
    try { await saveHackstartWorkshopSubmission(apiBase, task.id, content, completed); setNotice(completed ? '打卡已完成，并已同步到社区' : '草稿已保存'); await load(); }
    catch (cause) {setError(cause instanceof Error ? cause.message : '保存打卡失败');}
    finally {setBusy('');}
  }

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file || !task) return;
    setBusy('upload'); setError(''); setNotice('');
    try { await uploadHackstartWorkshopScreenshot(apiBase, task.id, file); setNotice('图片已上传'); await load(true); }
    catch (cause) {setError(cause instanceof Error ? cause.message : '上传图片失败');}
    finally {setBusy('');}
  }

  async function removeImage(src: string) {
    if (!submission?.id) return;
    setBusy(`remove:${src}`); setError('');
    try { await deleteHackstartWorkshopScreenshot(apiBase, submission.id, filenameFromURL(src)); await load(true); }
    catch (cause) {setError(cause instanceof Error ? cause.message : '删除图片失败');}
    finally {setBusy('');}
  }

  return <main className={styles.page}><WorkshopTabs />
    {notice && <p className={styles.success}><CheckCircle2 />{notice}</p>}
    {error && <p className={styles.error}>{error}</p>}
    {state === 'loading' && <section className={styles.state}><LoaderCircle className={styles.spin} /><strong>正在读取 Workshop 任务</strong><span>请稍候。</span></section>}
    {state === 'anonymous' && <section className={styles.state}><LogIn /><strong>登录后查看任务</strong><span>登录并开通 HackStart 年度会员后，可以提交 Workshop 打卡。</span><a href={loginHref}>登录 / 注册</a></section>}
    {state === 'forbidden' && <section className={styles.state}><LockKeyhole /><strong>需要 HackStart 年度会员</strong><span>会员可以阅读专属课程、完成任务并把成果公开到社区。</span><Link to="/membership/">了解年度会员</Link></section>}
    {state === 'error' && <section className={styles.state}><RefreshCw /><strong>任务服务暂时不可用</strong><button type="button" onClick={() => void load()}><RefreshCw />重新加载</button></section>}
    {state === 'ready' && !task && <section className={styles.state}><Wrench /><strong>这个 Workshop 还没有主任务</strong><span>请从 Workshop 目录选择其他任务，或等待管理员发布。</span></section>}
    {state === 'ready' && task && workshop && <article className={styles.task}><header className={styles.taskHeader}><span className={styles.taskNumber}>{String(workshop.position || 1).padStart(2, '0')}</span><div><small>{workshop.category || '通用'} · 约 {workshop.estimated_minutes || 60} 分钟</small><h1>{workshop.title}</h1><p>{workshop.summary}</p></div><b className={`${styles.status} ${styles[`status_${submission?.status || 'draft'}`]}`}>{submission?.completed ? '已完成' : STATUS_LABELS[submission?.status || 'draft']}</b></header><div className={styles.editor}><p className={styles.instructions}>{task.instructions || '完成这个 Workshop 的实践，并记录过程、验证结果和复盘。'}</p>{task.chapter_path && <Link className={styles.docLink} to={task.chapter_path}>打开对应文档</Link>}<label className={styles.field}>打卡内容<textarea value={content} onChange={(event) => {setContent(event.target.value); setCompleted(false);}} placeholder="写下你完成了什么、如何验证，以及最终结果和复盘" /></label><div className={styles.evidenceHeading}><strong><ImagePlus />成果图片（至少 1 张）</strong><span>支持 PNG / JPG，单张不超过 10 MB</span></div><div className={styles.images}>{(submission?.screenshots || []).map((src) => <figure key={src}><PrivateWorkshopImage hackadminBase={hackadminBase} src={src} alt={`${workshop.title} 成果`} onOpen={setLightbox} /><button type="button" title="删除图片" disabled={busy === `remove:${src}`} onClick={() => void removeImage(src)}><Trash2 /></button></figure>)}<button type="button" className={styles.upload} disabled={busy === 'upload'} onClick={() => fileInput.current?.click()}><Upload />{busy === 'upload' ? '上传中' : '上传成果图片'}<input ref={fileInput} type="file" accept="image/png,image/jpeg" hidden onChange={(event) => void upload(event)} /></button></div>{submission?.admin_comment && <div className={styles.feedback}><strong>历史反馈</strong><p>{submission.admin_comment}</p></div>}<div className={styles.actions}><label><input type="checkbox" checked={completed} onChange={(event) => setCompleted(event.target.checked)} />确认完成并公开打卡</label><button type="button" disabled={busy === 'save'} onClick={() => void save()}><Save />{busy === 'save' ? '保存中' : completed ? '提交打卡' : '保存草稿'}</button></div></div></article>}
    {lightbox && <div className={styles.lightbox} role="dialog" aria-label="成果大图" onClick={() => setLightbox('')}><button type="button" aria-label="关闭" onClick={() => setLightbox('')}>×</button><img src={lightbox} alt="Workshop 成果大图" /></div>}
  </main>;
}
