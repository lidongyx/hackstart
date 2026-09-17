export type Sub2ApiUser = {
  id?: number | string;
  email?: string;
  nickname?: string;
  username?: string;
  avatar_url?: string;
  role?: string;
  [key: string]: unknown;
};

type AuthResponse = {
  data?: Sub2ApiUser | null;
  user?: Sub2ApiUser | null;
};

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRES_AT_KEY = 'token_expires_at';
const DEFAULT_AUTH_API_URL = 'https://hackstart.org/api/v1/auth/me';

let authApiURL = DEFAULT_AUTH_API_URL;
let refreshApiURL = 'https://hackstart.org/api/v1/auth/refresh';
let refreshPromise: Promise<boolean> | null = null;
const AUTH_CHANGED_EVENT = 'hackstart:auth-changed';

export function configureSub2ApiAuth(url?: string, baseURL?: string): void {
  const normalized = url?.trim();
  if (normalized) authApiURL = normalized;
  if (baseURL) refreshApiURL = `${baseURL.replace(/\/$/, '')}/auth/refresh`;
}

export function consumeAuthTokenFromFragment(): void {
  if (typeof window === 'undefined' || !window.location.hash) return;

  const params = new URLSearchParams(window.location.hash.slice(1));
  const token = (params.get(AUTH_TOKEN_KEY) || params.get('access_token'))?.trim();
  if (!token) return;

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.localStorage.removeItem(AUTH_USER_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
  const refreshToken = params.get(REFRESH_TOKEN_KEY)?.trim();
  if (refreshToken) window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  const expiresIn = Number(params.get('expires_in'));
  if (Number.isFinite(expiresIn) && expiresIn > 0) {
    window.localStorage.setItem(TOKEN_EXPIRES_AT_KEY, String(Date.now() + expiresIn * 1000));
  }
  window.history.replaceState(window.history.state, document.title, `${window.location.pathname}${window.location.search}`);
}

export function notifySub2ApiAuthChanged(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function clearSub2ApiAuth(): void {
  if (typeof window === 'undefined') return;
  for (const key of [AUTH_TOKEN_KEY, AUTH_USER_KEY, REFRESH_TOKEN_KEY, TOKEN_EXPIRES_AT_KEY]) window.localStorage.removeItem(key);
  notifySub2ApiAuthChanged();
}

export function buildSub2ApiLoginURL(loginURL: string, returnURL: string): string {
  const target = new URL(loginURL, 'https://hackstart.org');
  target.searchParams.set('redirect', returnURL);
  return target.toString();
}

export function getSub2ApiToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getSub2ApiAuthHeaders(init?: HeadersInit): Headers {
  const headers = new Headers(init);
  const token = getSub2ApiToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return headers;
}

async function refreshAccessToken(): Promise<boolean> {
  const token = window.localStorage.getItem(REFRESH_TOKEN_KEY);
  const oldAccessToken = getSub2ApiToken();
  if (!token) return false;
  const response = await fetch(refreshApiURL, {
    method: 'POST', credentials: 'omit',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    body: JSON.stringify({refresh_token: token}),
  });
  const body = await response.json() as {data?: {access_token?: string; refresh_token?: string; expires_in?: number}};
  if (getSub2ApiToken() !== oldAccessToken) return Boolean(getSub2ApiToken());
  if (!response.ok || !body.data?.access_token || !body.data.refresh_token) {
    if (response.status === 401 || response.status === 403) clearSub2ApiAuth();
    return false;
  }
  window.localStorage.setItem(AUTH_TOKEN_KEY, body.data.access_token);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, body.data.refresh_token);
  window.localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
  if (body.data.expires_in && body.data.expires_in > 0) window.localStorage.setItem(TOKEN_EXPIRES_AT_KEY, String(Date.now() + body.data.expires_in * 1000));
  return true;
}

export async function sub2ApiFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const token = getSub2ApiToken();
  const send = () => fetch(input, {
    ...init,
    credentials: 'omit',
    headers: getSub2ApiAuthHeaders(init.headers),
  });
  const response = await send();
  if (response.status !== 401 || !token || init.signal?.aborted) return response;
  if (getSub2ApiToken() !== token) return getSub2ApiToken() ? send() : response;
  if (typeof window === 'undefined' || !window.localStorage.getItem(REFRESH_TOKEN_KEY)) return response;
  refreshPromise ??= refreshAccessToken().catch(() => false).finally(() => {refreshPromise = null;});
  const refreshed = await refreshPromise;
  return refreshed && !init.signal?.aborted ? send() : response;
}

function unwrapUser(payload: AuthResponse | Sub2ApiUser | null): Sub2ApiUser | null {
  if (!payload || typeof payload !== 'object') return null;
  const record = payload as Record<string, unknown>;
  if (Object.prototype.hasOwnProperty.call(record, 'data')) return (record.data as Sub2ApiUser | null) || null;
  if (Object.prototype.hasOwnProperty.call(record, 'user')) return (record.user as Sub2ApiUser | null) || null;
  return payload as Sub2ApiUser;
}

export async function fetchCurrentSub2ApiUser(signal?: AbortSignal): Promise<Sub2ApiUser | null> {
  if (!getSub2ApiToken()) return null;

  const response = await sub2ApiFetch(authApiURL, {
    headers: {Accept: 'application/json'},
    signal,
  });

  if (response.status === 401) return null;
  if (!response.ok) throw new Error(`无法确认登录状态（HTTP ${response.status}）`);

  return unwrapUser(await response.json() as AuthResponse | Sub2ApiUser | null);
}

export function subscribeToSub2ApiAuth(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;

  const watchedKeys = new Set([
    AUTH_TOKEN_KEY,
    AUTH_USER_KEY,
    REFRESH_TOKEN_KEY,
    TOKEN_EXPIRES_AT_KEY,
  ]);
  const handleStorage = (event: StorageEvent) => {
    if (event.storageArea === window.localStorage && watchedKeys.has(event.key || '')) onChange();
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(AUTH_CHANGED_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(AUTH_CHANGED_EVENT, onChange);
  };
}
