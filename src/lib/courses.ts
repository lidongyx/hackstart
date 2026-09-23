import {useEffect, useMemo, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export type HackstartCourse = {
  code: string;
  title: string;
  docs_path: string;
  access_mode: 'public' | 'member';
  position: number;
  published: boolean;
  category?: string;
  group?: string;
  nav_group?: string;
  summary?: string;
};

type CourseResponse = {
  items?: HackstartCourse[];
};

export type HackstartCoursesState = {
  courses: HackstartCourse[];
  status: 'loading' | 'ready' | 'error';
};

export const defaultCourseAccessModes: Record<string, HackstartCourse['access_mode']> = {
  integration: 'member',
  usecase: 'member',
  'plugin-skill-handbook': 'member',
  codexstart: 'member',
};

export const fallbackCourses: readonly HackstartCourse[] = [
  {code: 'codexstart', title: 'CodexStart 零基础课程', docs_path: 'codexstart', access_mode: defaultCourseAccessModes.codexstart, position: 4, published: true},
];

function normalizedCourses(items: HackstartCourse[] | undefined) {
  const byCode = new Map<string, HackstartCourse>();
  for (const item of items || []) {
    if (item.published === false || !item.code || !item.docs_path || !item.title) continue;
    // Workshop is a separate practice system with its own navigation and
    // should never appear in the member course library.
    const docsPath = item.docs_path.replace(/^\/+|\/+$/g, '').toLowerCase();
    if (item.code.toLowerCase() === 'workshop' || docsPath === 'workshop' || docsPath === 'workshops' || docsPath.startsWith('workshops/')) continue;
    byCode.set(item.code, {
      ...item,
      access_mode: 'member',
    });
  }
  return [...byCode.values()]
    .sort((a, b) => a.position - b.position || a.title.localeCompare(b.title, 'zh-CN'));
}

export function courseIntroPath(course: HackstartCourse) {
  return `/docs/${course.docs_path.replace(/^\/+|\/+$/g, '')}/intro/`;
}

export function useHackstartCoursesState(): HackstartCoursesState {
  const {siteConfig} = useDocusaurusContext();
  const apiURL = String(siteConfig.customFields?.coursesApiUrl || '');
  const [remoteCourses, setRemoteCourses] = useState<HackstartCourse[] | null>(null);
  const [status, setStatus] = useState<HackstartCoursesState['status']>(apiURL ? 'loading' : 'ready');

  useEffect(() => {
    if (!apiURL) {
      setRemoteCourses([...fallbackCourses]);
      setStatus('ready');
      return;
    }
    const controller = new AbortController();
    setStatus('loading');
    fetch(apiURL, {signal: controller.signal})
      .then((response) => response.ok ? response.json() as Promise<CourseResponse> : Promise.reject(new Error('course api failed')))
      .then((result) => {
        setRemoteCourses(normalizedCourses(result.items));
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setRemoteCourses(null);
          setStatus('error');
        }
      });
    return () => controller.abort();
  }, [apiURL]);

  return useMemo(() => ({
    courses: remoteCourses ?? [...fallbackCourses],
    status,
  }), [remoteCourses, status]);
}

export function useHackstartCourses() {
  return useHackstartCoursesState().courses;
}
