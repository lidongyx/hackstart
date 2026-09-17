import {clearToken, getRefreshToken, getToken} from './auth';
import type {Course, MembershipResponse, User} from './types';

const HACKADMIN_BASE = (import.meta.env.VITE_HACKADMIN_API_BASE_URL || 'https://hackadmin.hackweek.org').replace(/\/$/, '');
const SUB2API_BASE = (import.meta.env.VITE_SUB2API_API_BASE_URL || 'https://hackstart.org/api/v1').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(base: string, path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const response = await fetch(`${base}${path}`, {...options, headers, credentials: 'omit'});
  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : await response.text();
  if (response.status === 401 && retry && path !== '/auth/refresh' && getRefreshToken()) {
    try {
      await refreshAccessToken();
      return request<T>(base, path, options, false);
    } catch {
      clearToken();
    }
  }
  if (response.status === 401) clearToken();
  if (!response.ok) {
    const message = typeof body === 'string' ? body : body?.message || '请求失败';
    throw new ApiError(message, response.status);
  }
  return body as T;
}

async function refreshAccessToken(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('没有可用的刷新令牌');
  const response = await fetch(`${SUB2API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify({refresh_token: refreshToken}),
    credentials: 'omit',
  });
  const body = await response.json() as {data?: {access_token?: string; refresh_token?: string; expires_in?: number}; message?: string};
  const data = body.data;
  if (!response.ok || !data?.access_token || !data.refresh_token) throw new ApiError(body.message || '登录状态已过期', response.status);
  localStorage.setItem('auth_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  if (data.expires_in) localStorage.setItem('token_expires_at', String(Date.now() + data.expires_in * 1000));
}

export function getMe(): Promise<User> {
  return request<{data?: User; user?: User}>(HACKADMIN_BASE, '/api/me').then((body) => body.data || body.user || body as unknown as User);
}

export function getMembership(): Promise<MembershipResponse> {
  return request<MembershipResponse>(HACKADMIN_BASE, '/api/hackstart/membership');
}

export function getCourses(): Promise<{items: Course[]}> {
  return request<{items: Course[]}>(HACKADMIN_BASE, '/api/hackstart/courses');
}

export function updateHackadminProfile(payload: Pick<User, 'nickname' | 'city' | 'github_username' | 'website_url'>): Promise<User> {
  return request<User>(HACKADMIN_BASE, '/api/me', {method: 'PATCH', body: JSON.stringify(payload)});
}

export function uploadHackadminAvatar(file: File): Promise<User> {
  const form = new FormData();
  form.append('avatar', file);
  return request<User>(HACKADMIN_BASE, '/api/me/avatar', {method: 'POST', body: form});
}

export function syncSub2ApiProfile(payload: {username: string; avatar_url?: string | null}): Promise<User> {
  return request<{data?: User}>(SUB2API_BASE, '/user', {method: 'PUT', body: JSON.stringify(payload)}).then((body) => body.data as User);
}

export function logoutRemote(): Promise<void> {
  const refreshToken = getRefreshToken();
  return Promise.allSettled([
    request<void>(HACKADMIN_BASE, '/api/auth/logout', {method: 'POST'}),
    refreshToken ? request<void>(SUB2API_BASE, '/auth/logout', {method: 'POST', body: JSON.stringify({refresh_token: refreshToken})}) : Promise.resolve(),
  ]).then(() => undefined);
}
