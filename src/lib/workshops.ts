import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import {useEffect, useMemo, useState} from 'react';

import {sub2ApiFetch} from './sub2api-auth';

export type WorkshopSubmission = {
  id: number;
  content: string;
  screenshots: string[];
  completed: boolean;
  status: 'draft' | 'submitted' | 'approved' | 'changes_requested';
  admin_comment?: string;
  updated_at: string;
};

export type WorkshopTask = {
  id: number;
  title: string;
  instructions: string;
  chapter_path: string;
  position: number;
  required: boolean;
  published: boolean;
  submission?: WorkshopSubmission | null;
};

export type Workshop = {
  id: number;
  site_code: string;
  code: string;
  category: string;
  title: string;
  docs_path: string;
  cover_url: string;
  summary: string;
  description: string;
  difficulty: string;
  difficulty_score: number;
  estimated_minutes: number;
  position: number;
  published: boolean;
  tasks?: WorkshopTask[];
};

export type WorkshopResult = {
  id: number;
  content: string;
  screenshots: string[];
  status: WorkshopSubmission['status'];
  updated_at: string;
  user: {id: number; nickname?: string; email?: string; avatar_url?: string};
  workshop: Workshop;
};

export type WorkshopState = {items: Workshop[]; status: 'loading' | 'ready' | 'error'; error?: string; retry: () => void};
type WorkshopLoadState = Omit<WorkshopState, 'retry'>;

export function useWorkshopApi() {
  const {siteConfig} = useDocusaurusContext();
  const apiBase = String(siteConfig.customFields?.hackstartWorkshopApiBaseUrl || 'https://hackadmin.hackweek.org/api/hackstart').replace(/\/$/, '');
  const hackadminBase = String(siteConfig.customFields?.hackadminApiBaseUrl || 'https://hackadmin.hackweek.org').replace(/\/$/, '');
  return useMemo(() => ({apiBase, hackadminBase}), [apiBase, hackadminBase]);
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await sub2ApiFetch(url, {headers: {Accept: 'application/json', ...(init?.headers || {})}, ...init});
  const body = await response.json().catch(() => ({})) as {message?: string} & T;
  if (!response.ok) {
    const error = new Error(body.message || `请求失败（${response.status}）`) as Error & {status?: number};
    error.status = response.status;
    throw error;
  }
  return body;
}

export function useWorkshopSelection(): string {
  const {search} = useLocation();
  return new URLSearchParams(search).get('workshop') || '';
}

export function usePublicWorkshops(): WorkshopState {
  const {apiBase} = useWorkshopApi();
  const [state, setState] = useState<WorkshopLoadState>({items: [], status: 'loading'});
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState((current) => ({...current, status: 'loading'}));
    request<{items?: Workshop[]}>(`${apiBase}/workshops`, {signal: controller.signal})
      .then((body) => setState({items: body.items || [], status: 'ready'}))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setState({items: [], status: 'error', error: error instanceof Error ? error.message : '读取 Workshop 失败'});
      });
    return () => controller.abort();
  }, [apiBase, reloadKey]);
  return {...state, retry: () => setReloadKey((value) => value + 1)};
}

export async function fetchHackstartWorkshops(apiBase: string): Promise<{items: Workshop[]}> {
  return request<{items: Workshop[]}>(`${apiBase}/workshop-tasks`);
}

export async function fetchHackstartWorkshopResults(apiBase: string, params: {workshop?: string; page?: number} = {}): Promise<{items: WorkshopResult[]; pagination: {page: number; pages: number; total: number}}> {
  const query = new URLSearchParams({page: String(params.page || 1)});
  if (params.workshop) query.set('workshop', params.workshop);
  return request(`${apiBase}/workshop-results?${query.toString()}`);
}

export async function saveHackstartWorkshopSubmission(apiBase: string, taskID: number, content: string, completed: boolean) {
  return request<{id: number; status: WorkshopSubmission['status']; completed: boolean; screenshots: string[]; updated_at: string}>(`${apiBase}/workshop-tasks/${taskID}/submission`, {
    method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({content, completed}),
  });
}

export async function uploadHackstartWorkshopScreenshot(apiBase: string, taskID: number, file: File) {
  const form = new FormData();
  form.append('screenshot', file);
  return request<{id: number; screenshots: string[]}>(`${apiBase}/workshop-tasks/${taskID}/screenshots`, {method: 'POST', body: form});
}

export async function deleteHackstartWorkshopScreenshot(apiBase: string, submissionID: number, filename: string) {
  return request<{id: number; screenshots: string[]}>(`${apiBase}/workshop-submissions/${submissionID}/screenshots/${encodeURIComponent(filename)}`, {method: 'DELETE'});
}

export function workshopAssetURL(hackadminBase: string, value: string): string {
  return /^https?:\/\//i.test(value) ? value : `${hackadminBase}${value.startsWith('/') ? value : `/${value}`}`;
}

export function workshopDocsURL(value: string): string {
  const normalized = String(value || '').trim().replace(/^\/+|\/+$/g, '');
  if (!normalized) return '/docs/';
  const page = normalized.endsWith('/intro') ? normalized : `${normalized}/intro`;
  return `/docs/${page}/`;
}

export async function fetchWorkshopAsset(hackadminBase: string, value: string, signal?: AbortSignal): Promise<string> {
  const response = await sub2ApiFetch(workshopAssetURL(hackadminBase, value), {signal});
  if (!response.ok) throw new Error('图片读取失败');
  return URL.createObjectURL(await response.blob());
}
