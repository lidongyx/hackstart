import {sub2ApiFetch, getSub2ApiToken, clearSub2ApiAuth} from './sub2api-auth';
import type {Course, LearningHistoryItem, MembershipResponse, User} from './types';

let hackadminBase = 'https://hackadmin.hackweek.org';
let sub2ApiBase = 'https://hackstart.org/api/v1';

export function configureMemberApi(hackadmin?: string, sub2Api?: string): void {
  hackadminBase = (hackadmin || hackadminBase).replace(/\/$/, '');
  sub2ApiBase = (sub2Api || sub2ApiBase).replace(/\/$/, '');
}

export function avatarURL(value: string): string {
  return value.startsWith('/') ? `${hackadminBase}${value}` : value;
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(base: string, path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const response = await sub2ApiFetch(`${base}${path}`, {...options, headers});
  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof body === 'string' ? body : body?.message || '请求失败';
    throw new ApiError(message, response.status);
  }
  return body as T;
}

export function getMe(): Promise<User> {
  return request<{data?: User; user?: User}>(hackadminBase, '/api/me').then((body) => body.data || body.user || body as unknown as User);
}

export function getMembership(): Promise<MembershipResponse> {
  return request<MembershipResponse>(hackadminBase, '/api/hackstart/membership');
}

export function getCourses(): Promise<{items: Course[]}> {
  return request<{items: Course[]}>(hackadminBase, '/api/hackstart/courses');
}

export function getLearningHistory(): Promise<{items: LearningHistoryItem[]}> {
  return request<{items: LearningHistoryItem[]}>(hackadminBase, '/api/hackstart/learning-history');
}

export function recordLearningProgress(payload: {path: string; title?: string; course?: string}): Promise<void> {
  return request<void>(hackadminBase, '/api/hackstart/learning-progress', {method: 'POST', body: JSON.stringify(payload)});
}

export function updateHackadminProfile(payload: Pick<User, 'nickname' | 'city' | 'github_username' | 'website_url'>): Promise<User> {
  return request<User>(hackadminBase, '/api/me', {method: 'PATCH', body: JSON.stringify(payload)});
}

export function uploadHackadminAvatar(file: File): Promise<User> {
  const form = new FormData();
  form.append('avatar', file);
  return request<User>(hackadminBase, '/api/me/avatar', {method: 'POST', body: form});
}

export function syncSub2ApiProfile(payload: {username: string; avatar_url?: string | null}): Promise<User> {
  return request<{data?: User}>(sub2ApiBase, '/user', {method: 'PUT', body: JSON.stringify(payload)}).then((body) => body.data as User);
}

export function logoutRemote(): Promise<void> {
  if (!getSub2ApiToken()) { clearSub2ApiAuth(); return Promise.resolve(); }
  const refreshToken = window.localStorage.getItem('refresh_token');
  return Promise.allSettled([
    request<void>(hackadminBase, '/api/auth/logout', {method: 'POST'}),
    refreshToken ? request<void>(sub2ApiBase, '/auth/logout', {method: 'POST', body: JSON.stringify({refresh_token: refreshToken})}) : Promise.resolve(),
  ]).then(() => clearSub2ApiAuth());
}
