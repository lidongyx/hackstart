import React, {useMemo, useState, type FormEvent} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {ArrowRight, LoaderCircle, LockKeyhole, Mail, UserRound} from 'lucide-react';

import {fetchCurrentSub2ApiUser, loginWithSub2Api} from '@site/src/lib/sub2api-auth';
import styles from './styles.module.css';

function safeRedirect(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/';
  return value;
}

export default function LoginPage(): React.ReactNode {
  const {search} = typeof window === 'undefined' ? {search: ''} : window.location;
  const redirect = useMemo(() => safeRedirect(new URLSearchParams(search).get('redirect')), [search]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await loginWithSub2Api(email.trim(), password);
      // The login endpoint already returns the user. Keep the redirect independent
      // from the profile endpoint so a successful login never gets stranded here.
      if (response.user) window.localStorage.setItem('auth_user', JSON.stringify(response.user));
      await fetchCurrentSub2ApiUser().catch(() => null);
      window.location.replace(redirect);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '登录失败，请稍后重试');
    } finally {
      setBusy(false);
    }
  }

  return <Layout title="登录 HackStart" description="登录 HackStart 账号，继续 Workshop、课程和社区体验">
    <main className={styles.page}>
      <Link className={styles.brand} to="/"><img src="/img/hackstart.jpeg" alt="" /><span>HackStart</span></Link>
      <section className={styles.panel}>
        <div className={styles.heading}><span className={styles.icon}><UserRound /></span><p>HACKSTART ACCOUNT</p><h1>登录 HackStart</h1><span>登录后可以继续 Workshop、社区打卡和会员内容。</span></div>
        <form onSubmit={submit} className={styles.form}>
          <label><span>邮箱地址</span><div className={styles.input}><Mail /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required placeholder="you@example.com" /></div></label>
          <label><span>密码</span><div className={styles.input}><LockKeyhole /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required placeholder="请输入密码" /></div></label>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button type="submit" disabled={busy || !email.trim() || !password}><span>{busy ? <LoaderCircle className={styles.spin} /> : null}{busy ? '登录中' : '登录'}</span><ArrowRight /></button>
        </form>
        <p className={styles.note}>还没有账号？请在统一账号服务中完成注册和邮箱验证，登录后会自动回到当前页面。</p>
        <Link className={styles.back} to={redirect}>返回上一页</Link>
      </section>
    </main>
  </Layout>;
}
