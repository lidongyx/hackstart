import React, {useCallback, useEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {BookOpenText, Check, Clock3, Crown, ExternalLink, LoaderCircle, RefreshCw, Sparkles} from 'lucide-react';

import {fetchCurrentSub2ApiUser, sub2ApiFetch, type Sub2ApiUser} from '@site/src/lib/sub2api-auth';
import ResourceSidebar from '@site/src/components/resources/ResourceSidebar';
import styles from './styles.module.css';

type Membership = {
  active: boolean;
  member: boolean;
  purchase_count: number;
  started_at: string | null;
  expires_at: string | null;
};

type Order = {
  id: number;
  trade_order_id: string;
  title: string;
  amount_cents: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  provider: string;
  url_qrcode?: string;
  url?: string;
  paid_at?: string | null;
  created_at: string;
};

type MembershipResponse = {
  product: {code: string; title: string; amount_cents: number; duration_days: number};
  membership: Membership;
  orders: Order[];
  provider_enabled: boolean;
};

type PaymentResponse = {order: Order; url_qrcode?: string; url?: string};

function formatDate(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString('zh-CN', {hour12: false}) : '—';
}

export default function MembershipPage(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const apiURL = String(siteConfig.customFields?.membershipApiUrl || '');
  const [session, setSession] = useState<Sub2ApiUser | null | undefined>(undefined);
  const [data, setData] = useState<MembershipResponse | null>(null);
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const pollTimer = useRef<number | undefined>(undefined);

  const load = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setError('');
    try {
      const currentUser = await fetchCurrentSub2ApiUser();
      setSession(currentUser);
      if (!currentUser) {
        setData(null);
        return;
      }
      const response = await sub2ApiFetch(apiURL, {headers: {Accept: 'application/json'}});
      if (!response.ok) throw new Error('无法读取会员状态');
      setData(await response.json() as MembershipResponse);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '暂时无法读取会员状态');
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, [apiURL]);

  useEffect(() => {
    void load();
    return () => window.clearTimeout(pollTimer.current);
  }, [load]);

  const returnURL = typeof window === 'undefined' ? `${siteConfig.url}/membership/` : window.location.href;
  const loginHref = useMemo(() => `/login/?redirect=${encodeURIComponent(returnURL.startsWith('/') ? returnURL : '/membership/')}`, [returnURL]);
  const pendingOrder = data?.orders.find((order) => order.status === 'pending');
  const canBuy = Boolean(data?.provider_enabled && !pendingOrder);
  const priceCents = data?.product.amount_cents || 6800;

  async function createOrder() {
    setSubmitting(true);
    setError('');
    try {
      const response = await sub2ApiFetch(`${apiURL}/orders`, {method: 'POST', headers: {Accept: 'application/json'}});
      const body = await response.json() as PaymentResponse & {message?: string};
      if (!response.ok) throw new Error(body.message || '创建支付订单失败');
      setPayment(body);
      await load(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '创建支付订单失败');
    } finally {
      setSubmitting(false);
    }
  }

  async function refreshStatus() {
    setRefreshing(true);
    await load(false);
    setRefreshing(false);
  }

  useEffect(() => {
    if (!pendingOrder) return;
    pollTimer.current = window.setTimeout(() => void refreshStatus(), 5000);
    return () => window.clearTimeout(pollTimer.current);
  }, [pendingOrder, refreshing]);

  return (
    <Layout title="HackStart 永久会员" description="加入 HackStart 永久会员，永久阅读完整的 Codex 学习内容。">
      <div className={styles.shell}>
        <ResourceSidebar membershipMode />
        <main className={styles.page}>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <p className={styles.kicker}>HACKSTART 会员系列</p>
              <Heading as="h1">一次加入，把 Codex 学明白</Heading>
              <p className={styles.lead}>从零开始的课程、真实案例和可复用的工具方法，持续更新，适合边做边学。</p>
              <div className={styles.heroPoints}>
                <span><BookOpenText />完整课程与文章</span>
                <span><Sparkles />持续加入新内容</span>
              </div>
            </div>
            <aside className={styles.priceCard}>
              <div className={styles.priceCardTop}><Crown /><span>永久会员</span></div>
              <div className={styles.price}>¥{(priceCents / 100).toFixed(0)}<small> / 永久</small></div>
              <p>开通后永久可阅读系列课程的全部内容，课程与文章统一按会员权限开放。</p>
              <strong>内容越丰富，价格会持续上涨</strong>
            </aside>
          </section>

          <section className={styles.valueSection}>
            <div className={styles.sectionHeading}>
              <Heading as="h2">会员能看到什么</Heading>
              <p>系列课程、课程目录和文章统一按会员权限开放，开通后即可完整阅读。</p>
            </div>
            <div className={styles.valueList}>
              <div><BookOpenText /><span><strong>CodexStart 零基础课程</strong><small>从第一次使用到完整工作流，按步骤建立实践能力。</small></span></div>
              <div><Sparkles /><span><strong>持续更新的实践内容</strong><small>新增案例、插件与技能方法，会不断补充到会员系列。</small></span></div>
              <div><Crown /><span><strong>永久反复阅读</strong><small>一次开通，当前内容和后续新增内容都可以阅读。</small></span></div>
            </div>
          </section>

          {loading && <section className={styles.state}><LoaderCircle className={styles.spin} /><span>正在读取会员状态</span></section>}
          {!loading && !session && <section className={styles.actionPanel}><div><Heading as="h2">登录后即可加入</Heading><p>使用 HackStart 账号登录，支付完成后会自动回到这里。</p></div><Link className={styles.primary} to={loginHref}>登录并继续 <ExternalLink /></Link></section>}
          {!loading && session && data && (
            <>
              <section className={styles.grid}>
                <article className={styles.panel}>
                  <p className={styles.eyebrow}>你的账户</p>
                  <Heading as="h2">{session.nickname || session.email || 'HackStart 用户'}</Heading>
                  <p>{session.email}</p>
                  <div className={styles.statusRow}><span>会员状态</span><strong className={data.membership.active ? styles.active : styles.muted}>{data.membership.active ? '永久会员有效' : data.membership.member ? '会员已到期' : '尚未开通'}</strong></div>
                  <div className={styles.statusRow}><span>有效期至</span><strong>{formatDate(data.membership.expires_at)}</strong></div>
                  <div className={styles.statusRow}><span>已购买</span><strong>{data.membership.purchase_count} 次</strong></div>
                </article>
                <article className={`${styles.panel} ${styles.offer}`}>
                  <p className={styles.eyebrow}>加入会员</p>
                  <Heading as="h2">HackStart 永久会员</Heading>
                  <p className={styles.offerLead}>一次开通，永久阅读会员课程、文章和后续新增内容。</p>
                  <div className={styles.offerPrice}>¥{(data.product.amount_cents / 100).toFixed(0)}<small> / 永久</small></div>
                  {data.membership.active && <div className={styles.success}><Check />当前有效至 {formatDate(data.membership.expires_at)}</div>}
                  <button className={styles.primary} disabled={!canBuy || submitting} onClick={createOrder}>{submitting ? <LoaderCircle className={styles.spin} /> : <Clock3 />}{submitting ? '正在创建订单' : data.provider_enabled ? data.membership.active ? '继续购买' : '开通永久会员' : '支付暂未开放'}</button>
                  <small className={styles.hint}>会员费用只用于课程阅读，不会增加或扣减 API 余额。</small>
                </article>
              </section>

              {pendingOrder && <section className={styles.paymentPanel}><div><p className={styles.eyebrow}>完成支付</p><Heading as="h2">扫码加入会员</Heading><p>支付完成后点击刷新状态，系统确认后会立即开通或延长会员。</p><button className={styles.secondary} onClick={refreshStatus} disabled={refreshing}>{refreshing ? <LoaderCircle className={styles.spin} /> : <RefreshCw />}{refreshing ? '刷新中' : '刷新支付状态'}</button></div>{(payment?.url_qrcode || pendingOrder.url_qrcode) ? <img className={styles.qrcode} src={payment?.url_qrcode || pendingOrder.url_qrcode} alt="支付二维码" /> : (payment?.url || pendingOrder.url) ? <a className={styles.primary} href={payment?.url || pendingOrder.url} target="_blank" rel="noreferrer">打开支付页面 <ExternalLink /></a> : <span className={styles.hint}>订单已创建，请稍候加载支付信息。</span>}</section>}
              {data.membership.active && <section className={styles.successPanel}><Check /><div><Heading as="h2">会员已生效</Heading><p>现在可以阅读 CodexStart 和其他会员系列中的文章。</p></div><Link className={styles.primary} to="/docs/codexstart/intro/">查看课程目录</Link></section>}
              <section className={styles.orders}><div className={styles.ordersHeading}><Heading as="h2">购买记录</Heading><button className={styles.iconButton} title="刷新购买记录" onClick={refreshStatus}><RefreshCw /></button></div>{data.orders.length ? data.orders.slice(0, 5).map((order) => <div className={styles.order} key={order.id}><span>{order.title}</span><strong>¥{(order.amount_cents / 100).toFixed(0)}</strong><em className={styles[order.status]}>{order.status === 'paid' ? '已支付' : order.status === 'pending' ? '待支付' : order.status === 'failed' ? '失败' : '已取消'}</em><small>{formatDate(order.paid_at || order.created_at)}</small></div>) : <p className={styles.hint}>还没有购买记录。</p>}</section>
            </>
          )}
          {error && <p className={styles.error}>{error}</p>}
          <footer className={styles.footer}><Link to="/docs/codexstart/intro/">先浏览课程目录</Link><span>课程目录公开，文章正文按课程权限开放。</span></footer>
        </main>
      </div>
    </Layout>
  );
}
