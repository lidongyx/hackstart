import {useEffect, useMemo, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {bookCatalog, bookEntryPath} from '@site/src/lib/bookCatalog';

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
  ...Object.fromEntries(bookCatalog.map((book) => [book.code, book.accessMode])),
};

export const fallbackCourses: readonly HackstartCourse[] = bookCatalog.map((book) => ({
  code: book.code,
  title: book.title,
  docs_path: book.docsPath,
  access_mode: book.accessMode,
  position: book.position,
  published: true,
  category: book.category,
  group: book.category,
  nav_group: book.category,
  summary: book.summary,
}));

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
      access_mode: defaultCourseAccessModes[item.code] || item.access_mode || 'member',
    });
  }
  for (const fallback of fallbackCourses) {
    if (!byCode.has(fallback.code)) byCode.set(fallback.code, fallback);
  }
  return [...byCode.values()]
    .sort((a, b) => a.position - b.position || a.title.localeCompare(b.title, 'zh-CN'));
}

export function courseIntroPath(course: HackstartCourse) {
  return bookEntryPath({docsPath: course.docs_path.replace(/^\/+|\/+$/g, '')});
}

const COURSES_CACHE_TTL_MS = 5 * 60 * 1000;
let cachedCoursesUrl = '';
let cachedCoursesList: HackstartCourse[] | null = null;
let cachedCoursesAt = 0;
let coursesInFlight: Promise<HackstartCourse[]> | null = null;

function fetchCoursesCached(apiURL: string): Promise<HackstartCourse[]> {
  if (cachedCoursesList && cachedCoursesUrl === apiURL && Date.now() - cachedCoursesAt < COURSES_CACHE_TTL_MS) {
    return Promise.resolve(cachedCoursesList);
  }
  if (!coursesInFlight || cachedCoursesUrl !== apiURL) {
    cachedCoursesUrl = apiURL;
    coursesInFlight = fetch(apiURL)
      .then((response) => response.ok ? response.json() as Promise<CourseResponse> : Promise.reject(new Error('course api failed')))
      .then((result) => {
        const list = normalizedCourses(result.items);
        cachedCoursesList = list;
        cachedCoursesAt = Date.now();
        return list;
      })
      .finally(() => {
        coursesInFlight = null;
      });
  }
  return coursesInFlight;
}

export function useHackstartCoursesState(enabled = true): HackstartCoursesState {
  const {siteConfig} = useDocusaurusContext();
  const apiURL = String(siteConfig.customFields?.coursesApiUrl || '');
  const hasWarmCache = Boolean(enabled && apiURL && cachedCoursesList && cachedCoursesUrl === apiURL && Date.now() - cachedCoursesAt < COURSES_CACHE_TTL_MS);
  const [remoteCourses, setRemoteCourses] = useState<HackstartCourse[] | null>(hasWarmCache ? cachedCoursesList : null);
  const [status, setStatus] = useState<HackstartCoursesState['status']>(hasWarmCache || !enabled || !apiURL ? 'ready' : 'loading');

  useEffect(() => {
    if (!enabled || !apiURL) {
      setRemoteCourses([...fallbackCourses]);
      setStatus('ready');
      return;
    }
    let mounted = true;
    if (!cachedCoursesList || cachedCoursesUrl !== apiURL || Date.now() - cachedCoursesAt >= COURSES_CACHE_TTL_MS) {
      setStatus('loading');
    }
    fetchCoursesCached(apiURL)
      .then((list) => {
        if (!mounted) return;
        setRemoteCourses(list);
        setStatus('ready');
      })
      .catch(() => {
        if (!mounted) return;
        setRemoteCourses(null);
        setStatus('error');
      });
    return () => {
      mounted = false;
    };
  }, [apiURL, enabled]);

  return useMemo(() => ({
    courses: remoteCourses ?? [...fallbackCourses],
    status,
  }), [remoteCourses, status]);
}

export function useHackstartCourses() {
  return useHackstartCoursesState().courses;
}
