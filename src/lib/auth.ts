const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRES_AT_KEY = 'token_expires_at';

type AuthFragment = {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
};

export function consumeAuthTokenFromFragment(): void {
  if (typeof window === 'undefined' || !window.location.hash) return;
  const params = new URLSearchParams(window.location.hash.slice(1));
  const auth = readAuthFragment(params);
  if (!auth) return;
  localStorage.setItem(TOKEN_KEY, auth.accessToken);
  if (auth.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
  if (auth.expiresIn) localStorage.setItem(TOKEN_EXPIRES_AT_KEY, String(Date.now() + auth.expiresIn * 1000));
  window.history.replaceState(window.history.state, document.title, `${window.location.pathname}${window.location.search}`);
}

function readAuthFragment(params: URLSearchParams): AuthFragment | null {
  const accessToken = (params.get(TOKEN_KEY) || params.get('access_token') || '').trim();
  if (!accessToken) return null;
  const refreshToken = (params.get(REFRESH_TOKEN_KEY) || '').trim() || undefined;
  const rawExpiresIn = Number(params.get('expires_in'));
  return {
    accessToken,
    refreshToken,
    expiresIn: Number.isFinite(rawExpiresIn) && rawExpiresIn > 0 ? rawExpiresIn : undefined,
  };
}

export function getToken(): string | null {
  return typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
}

export function getRefreshToken(): string | null {
  return typeof window === 'undefined' ? null : localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getTokenExpiresAt(): number | null {
  if (typeof window === 'undefined') return null;
  const value = Number(localStorage.getItem(TOKEN_EXPIRES_AT_KEY));
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function loginURL(path = window.location.pathname): string {
  const target = new URL('https://hackstart.org/login');
  target.searchParams.set('redirect', `${window.location.origin}${path}`);
  return target.toString();
}

export function subscribeToAuth(onChange: () => void): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (event.storageArea === localStorage && event.key === TOKEN_KEY) onChange();
  };
  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}
