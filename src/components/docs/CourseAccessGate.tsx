import React, {useEffect, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {LoaderCircle, LockKeyhole} from 'lucide-react';

import type {HackstartCourse} from '@site/src/lib/courses';
import {buildSub2ApiLoginURL, fetchCurrentSub2ApiUser, sub2ApiFetch} from '@site/src/lib/sub2api-auth';
import styles from './CourseAccessGate.module.css';

type AccessResponse = {
  allowed?: boolean;
  reason?: string;
};

type State = 'loading' | 'allowed' | 'anonymous' | 'locked' | 'error';

type Props = {
  course?: HackstartCourse;
  courseStatus?: 'loading' | 'ready' | 'error';
  children: ReactNode;
};

export default function CourseAccessGate({course, courseStatus = 'ready', children}: Props): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const accessApiBaseURL = String(siteConfig.customFields?.courseAccessApiBaseUrl || '');
  const membershipLoginURL = String(siteConfig.customFields?.membershipLoginUrl || 'https://hackstart.org/login');
  const [state, setState] = useState<State>(courseStatus === 'ready' && course?.access_mode === 'public' ? 'allowed' : 'loading');

  useEffect(() => {
    if (courseStatus === 'loading') {
      setState('loading');
      return;
    }
    if (courseStatus === 'error' || !course) {
      setState('error');
      return;
    }
    if (course.access_mode === 'public') {
      setState('allowed');
      return;
    }
    if (!accessApiBaseURL) {
      setState('error');
      return;
    }

    const controller = new AbortController();
    fetchCurrentSub2ApiUser(controller.signal)
      .then(async (user) => {
        if (!user) {
          setState('anonymous');
          return;
        }
        const accessURL = `${accessApiBaseURL.replace(/\/$/, '')}/${encodeURIComponent(course.code)}`;
        const accessResponse = await sub2ApiFetch(accessURL, {signal: controller.signal, headers: {Accept: 'application/json'}});
        if (!accessResponse.ok) throw new Error('access api failed');
        const access = await accessResponse.json() as AccessResponse;
        setState(access.allowed ? 'allowed' : 'locked');
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setState('error');
      });
    return () => controller.abort();
  }, [accessApiBaseURL, course, courseStatus]);

  if (state === 'allowed') return children;

  const returnURL = typeof window === 'undefined' ? '/' : window.location.href;
  const loginURL = buildSub2ApiLoginURL(membershipLoginURL, returnURL);

  return (
    <section className={styles.gate}>
      {state === 'loading' ? <LoaderCircle className={styles.spinner} /> : <LockKeyhole />}
      <p>{state === 'loading' ? 'CHECKING ACCESS' : 'MEMBERSHIP REQUIRED'}</p>
      <h1>{state === 'loading' ? '正在确认课程权限' : state === 'error' && courseStatus === 'ready' && !course ? '本课程暂未上架' : state === 'error' ? '暂时无法确认阅读权限' : '本课程仅限会员阅读'}</h1>
      <span>
        {state === 'loading' && '请稍候。'}
        {state === 'anonymous' && '登录 HackStart 后即可确认会员状态，继续阅读本篇内容。'}
        {state === 'locked' && '加入 HackStart 年度会员后，即可阅读会员系列中的全部文章。'}
        {state === 'error' && courseStatus === 'ready' && !course && '该课程已下架或尚未在课程管理中启用。'}
        {state === 'error' && !(courseStatus === 'ready' && !course) && '课程权限服务暂时不可用，请稍后刷新页面。'}
      </span>
      {state === 'anonymous' && <Link href={loginURL}>登录后继续</Link>}
      {state === 'locked' && <Link to="/membership/">了解年度会员</Link>}
      {state === 'error' && !(courseStatus === 'ready' && !course) && <button type="button" onClick={() => globalThis.location?.reload()}>重新加载</button>}
    </section>
  );
}
