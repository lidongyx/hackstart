import Layout from '@theme/Layout';
import WorkshopCheckin from '@site/src/components/workshops/WorkshopCheckin';
import WorkshopShell from '@site/src/components/workshops/WorkshopShell';

export default function WorkshopTasksPage(): React.ReactNode {
  return <Layout title="我的 Workshop 任务" description="完成 HackStart Workshop 并提交社区打卡"><WorkshopShell><WorkshopCheckin/></WorkshopShell></Layout>;
}
