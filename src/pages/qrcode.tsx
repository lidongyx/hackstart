import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './qrcode.module.css';

const groupQrcodeUrl =
  'https://hackweek-1251009918.cos.ap-shanghai.myqcloud.com/hackstart/wechatgroup.jpg';

const supportItems = [
  {
    title: '安装与使用协助',
    description:
      '如果遇到安装、配置或使用问题，可以下载“网易 UU 远程”，联系群主帮忙远程协助排查。',
  },
  {
    title: 'Codex 学习交流',
    description:
      '进群后可以一起交流 Codex 的使用方法、提示词组织、仓库改造、自动化任务和更多具体应用场景。',
  },
  {
    title: 'HackStart API 售后客服',
    description:
      'HackStart API 的充值、额度、接入、模型调用等售后问题，都可以随时在群里沟通。',
  },
] as const;

export default function QrcodePage(): ReactNode {
  return (
    <Layout
      title="HackStart 技术交流群"
      description="扫码加入 HackStart 技术交流群，获取安装使用协助、Codex 交流和 HackStart API 售后支持。">
      <main className={styles.supportPage}>
        <section className={styles.hero}>
          <div className={styles.intro}>
            <span className={styles.kicker}>HACKSTART COMMUNITY</span>
            <Heading as="h1">加入 HackStart 技术交流群</Heading>
            <p className={styles.lead}>
              使用微信扫码进群，获取 Codex 使用交流、HackStart API 售后支持和必要的远程协助。
            </p>
          </div>

          <div className={styles.qrWrap}>
            <aside className={styles.qrCard} aria-label="HackStart 微信群二维码">
              <div className={styles.qrFrame}>
                <img className={styles.qrImage} src={groupQrcodeUrl} alt="HackStart 微信群二维码" />
              </div>
              <p className={styles.qrCaption}>
                微信扫码加入交流群。如二维码过期，可在 HackStart 控制台或客服渠道获取更新入口。
              </p>
            </aside>
          </div>

          <div className={styles.supportIntro}>
            <Heading as="h2">进群后可以获得这些支持</Heading>
          </div>

          <div className={styles.supportList}>
            {supportItems.map((item) => (
              <article key={item.title} className={styles.supportItem}>
                <Heading as="h3">{item.title}</Heading>
                <p>{item.description}</p>
              </article>
            ))}
          </div>

          <div className={styles.actions}>
            <Link className={styles.primaryButton} to="/docs/integration/intro/">
              查看接入教程
            </Link>
            <Link className={styles.secondaryButton} to="/">
              返回首页
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
