import React, {useEffect, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {LoaderCircle, LockKeyhole} from 'lucide-react';

import type {HackstartCourse} from '@site/src/lib/courses';
import {clearSub2ApiAuth, getSub2ApiToken, sub2ApiFetch, subscribeToSub2ApiAuth} from '@site/src/lib/sub2api-auth';
import styles from './CourseAccessGate.module.css';

type AccessResponse = {
  membership?: {active?: boolean};
  reason?: string;
};

type State = 'loading' | 'allowed' | 'anonymous' | 'locked' | 'error';

const ACCESS_CACHE_TTL_MS = 60_000;
let cachedAccessToken: string | null = null;
let cachedAccessState: Exclude<State, 'loading' | 'error'> | null = null;
let cachedAccessAt = 0;
let accessInFlight: Promise<Exclude<State, 'loading' | 'error'>> | null = null;

function resetAccessCache(): void {
  cachedAccessToken = null;
  cachedAccessState = null;
  cachedAccessAt = 0;
  accessInFlight = null;
}

function checkMembershipAccess(accessApiBaseURL: string): Promise<Exclude<State, 'loading' | 'error'>> {
  const token = getSub2ApiToken();
  if (!token) {
    resetAccessCache();
    return Promise.resolve('anonymous');
  }
  if (cachedAccessState && cachedAccessToken === token && Date.now() - cachedAccessAt < ACCESS_CACHE_TTL_MS) {
    return Promise.resolve(cachedAccessState);
  }
  if (!accessInFlight || cachedAccessToken !== token) {
    cachedAccessToken = token;
    accessInFlight = sub2ApiFetch(accessApiBaseURL, {headers: {Accept: 'application/json'}})
      .then(async (response) => {
        if (response.status === 401) {
          clearSub2ApiAuth();
          return 'anonymous' as const;
        }
        if (!response.ok) throw new Error('access api failed');
        const access = await response.json() as AccessResponse;
        const next: Exclude<State, 'loading' | 'error'> = access.membership?.active ? 'allowed' : 'locked';
        if (getSub2ApiToken() === token) {
          cachedAccessState = next;
          cachedAccessAt = Date.now();
        }
        return next;
      })
      .finally(() => {
        accessInFlight = null;
      });
  }
  return accessInFlight;
}

type Props = {
  course?: HackstartCourse;
  courseStatus?: 'loading' | 'ready' | 'error';
  children: ReactNode;
};

export default function CourseAccessGate({course, courseStatus = 'ready', children}: Props): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const accessApiBaseURL = String(siteConfig.customFields?.membershipApiUrl || '');
  const token = getSub2ApiToken();
  const warmState: State = !token
    ? 'anonymous'
    : cachedAccessState && cachedAccessToken === token && Date.now() - cachedAccessAt < ACCESS_CACHE_TTL_MS
      ? cachedAccessState
      : 'loading';
  const [state, setState] = useState<State>(warmState);

  useEffect(() => {
    if (!accessApiBaseURL) {
      setState('error');
      return;
    }

    let mounted = true;
    const verify = () => {
      if (!getSub2ApiToken()) {
        resetAccessCache();
        if (mounted) setState('anonymous');
        return;
      }
      checkMembershipAccess(accessApiBaseURL)
        .then((next) => {
          if (mounted) setState(next);
        })
        .catch(() => {
          if (mounted) setState('error');
        });
    };
    verify();
    const unsubscribe = subscribeToSub2ApiAuth(() => {
      resetAccessCache();
      verify();
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [accessApiBaseURL, course, courseStatus]);

  if (state === 'allowed') return children;

  const loginURL = `/login/?redirect=${encodeURIComponent(typeof window === 'undefined' ? '/' : window.location.pathname + window.location.search)}`;

  return (
    <section className={styles.gate}>
      {state === 'loading' ? <LoaderCircle className={styles.spinner} /> : <LockKeyhole />}
      <p>{state === 'loading' ? 'CHECKING ACCESS' : 'MEMBERSHIP REQUIRED'}</p>
      <h1>{state === 'loading' ? '正在确认课程权限' : state === 'error' && courseStatus === 'ready' && !course ? '本课程暂未上架' : state === 'error' ? '暂时无法确认阅读权限' : '本内容仅限永久会员阅读'}</h1>
      <span>
        {state === 'loading' && '请稍候。'}
        {state === 'anonymous' && '登录 HackStart 后即可确认会员状态，继续阅读本篇内容。'}
        {state === 'locked' && '加入 HackStart 永久会员后，即可阅读会员系列中的全部文章。'}
        {state === 'error' && courseStatus === 'ready' && !course && '该课程已下架或尚未在课程管理中启用。'}
        {state === 'error' && !(courseStatus === 'ready' && !course) && '课程权限服务暂时不可用，请稍后刷新页面。'}
      </span>
      {state === 'anonymous' && <Link to={loginURL}>登录后继续</Link>}
      {state === 'locked' && <Link to="/membership/">了解永久会员</Link>}
      {state === 'error' && !(courseStatus === 'ready' && !course) && <button type="button" onClick={() => globalThis.location?.reload()}>重新加载</button>}
    </section>
  );
}
