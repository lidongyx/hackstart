import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/sub2api-auth.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022}}).outputText;
const auth = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const storage = new Map();
const events = new EventTarget();
let replaced;
globalThis.document = {title: 'HackStart'};
globalThis.window = {
  location: {hash: '', pathname: '/account/', search: '?from=test'},
  history: {state: null, replaceState: (_state, _title, url) => {replaced = url;}},
  localStorage: {getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, String(value)), removeItem: key => storage.delete(key)},
  dispatchEvent: event => events.dispatchEvent(event),
  addEventListener: (...args) => events.addEventListener(...args),
  removeEventListener: (...args) => events.removeEventListener(...args),
};
const json = (body, status = 200) => new Response(JSON.stringify(body), {status, headers: {'content-type': 'application/json'}});

test('login fragment stores access/refresh/expiry and removes tokens from URL', () => {
  storage.clear(); window.location.hash = '#access_token=mock-access&refresh_token=mock-refresh&expires_in=3600';
  auth.consumeAuthTokenFromFragment();
  assert.equal(storage.get('auth_token'), 'mock-access');
  assert.equal(storage.get('refresh_token'), 'mock-refresh');
  assert.ok(Number(storage.get('token_expires_at')) > Date.now());
  assert.equal(replaced, '/account/?from=test');
});

test('login fragment restores the original document anchor after consuming tokens', () => {
  window.location.hash = '#auth_token=mock-access&return_hash=%23intro';
  auth.consumeAuthTokenFromFragment();
  assert.equal(replaced, '/account/?from=test#intro');
});

test('a new legacy login cannot inherit another account refresh token', () => {
  window.location.hash = '#auth_token=legacy-token'; auth.consumeAuthTokenFromFragment();
  assert.equal(storage.get('auth_token'), 'legacy-token');
  assert.equal(storage.has('refresh_token'), false);
  assert.equal(storage.has('token_expires_at'), false);
});

test('document anchors do not change credentials', () => {
  window.location.hash = '#course-section'; auth.consumeAuthTokenFromFragment();
  assert.equal(storage.get('auth_token'), 'legacy-token');
});

test('concurrent 401s refresh once and retry with the rotated bearer', async () => {
  storage.set('auth_token', 'expired'); storage.set('refresh_token', 'refresh');
  let refreshes = 0;
  globalThis.fetch = async (input, init) => {
    if (String(input).endsWith('/auth/refresh')) {refreshes++; await new Promise(resolve => setTimeout(resolve, 10)); return json({data: {access_token: 'rotated', refresh_token: 'rotated-refresh', expires_in: 60}});}
    assert.equal(init.credentials, 'omit');
    return new Headers(init.headers).get('Authorization') === 'Bearer rotated' ? json({ok: true}) : json({}, 401);
  };
  const results = await Promise.all([auth.sub2ApiFetch('https://mock.test/one'), auth.sub2ApiFetch('https://mock.test/two')]);
  assert.deepEqual(results.map(response => response.status), [200, 200]);
  assert.equal(refreshes, 1); assert.equal(storage.get('refresh_token'), 'rotated-refresh');
});

test('revoked refresh clears credentials and notifies same-tab listeners', async () => {
  storage.set('auth_token', 'expired'); storage.set('refresh_token', 'revoked');
  let notified = 0; const unsubscribe = auth.subscribeToSub2ApiAuth(() => notified++);
  globalThis.fetch = async () => json({}, 401);
  assert.equal((await auth.sub2ApiFetch('https://mock.test/me')).status, 401);
  assert.equal(storage.has('auth_token'), false); assert.equal(storage.has('refresh_token'), false);
  assert.equal(notified, 1); unsubscribe();
});

test('temporary refresh outage preserves credentials without infinite retries', async () => {
  storage.set('auth_token', 'expired'); storage.set('refresh_token', 'valid');
  let requests = 0;
  globalThis.fetch = async input => {requests++; return json({}, String(input).endsWith('/auth/refresh') ? 503 : 401);};
  assert.equal((await auth.sub2ApiFetch('https://mock.test/me')).status, 401);
  assert.equal(requests, 2); assert.equal(storage.get('refresh_token'), 'valid');
});

test('login redirect keeps the new site and deep document URL', () => {
  const url = new URL(auth.buildSub2ApiLoginURL('https://hackstart.org/login', 'https://i.hackstart.org/docs/codexstart/first/#intro'));
  assert.equal(url.origin, 'https://hackstart.org');
  assert.equal(url.searchParams.get('redirect'), 'https://i.hackstart.org/docs/codexstart/first/#intro');
});
