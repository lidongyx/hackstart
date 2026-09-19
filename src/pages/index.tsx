import React, {useEffect, useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import Layout from '@theme/Layout';
import {ArrowUpRight, AtSign, Crown, GitBranch, Search, X} from 'lucide-react';

import {
  categories,
  categoryLabel,
  modelingSubcategories,
  resourceDetailPath,
  resourceImage,
  normalizeResource,
  normalizeSkill,
  seedResources,
  type Resource,
  type ResourceCategory,
  type Skill,
} from '@site/src/lib/resources';
import ResourceSidebar from '@site/src/components/resources/ResourceSidebar';
import styles from './index.module.css';

type ResourceResponse = {
  items?: Resource[];
  total?: number;
  page?: number;
  pages?: number;
};

type SkillResponse = ResourceResponse & {
  items?: Skill[];
  categories?: SkillCategory[];
};

type SkillCategory = {
  category_key: string;
  category_name: string;
  count: number;
};

const pageSize = 12;

function getResourceResponse(payload: Resource[] | ResourceResponse) {
  if (Array.isArray(payload)) {
    return {items: payload.map((item) => normalizeResource(item as Resource)), total: payload.length, page: 1, pages: Math.max(1, Math.ceil(payload.length / pageSize)), serverPaginated: false};
  }
  const items = (payload.items || []).map((item) => normalizeResource(item as Resource));
  const serverPaginated = typeof payload.total === 'number' || typeof payload.page === 'number' || typeof payload.pages === 'number';
  const total = typeof payload.total === 'number' ? payload.total : items.length;
  return {
    items,
    total,
    page: payload.page || 1,
    pages: payload.pages || Math.max(1, Math.ceil(total / pageSize)),
    serverPaginated,
  };
}

function SourceIcon({platform}: {platform?: string}) {
  const Icon = platform === 'github' ? GitBranch : platform === 'x' ? AtSign : ArrowUpRight;
  return <span className={styles.sourceIcon}><Icon aria-hidden="true" /></span>;
}

function numberValue(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function compactNumber(value: unknown): string {
  return new Intl.NumberFormat('zh-CN', {notation: 'compact', maximumFractionDigits: 1}).format(numberValue(value));
}

function formatDate(value: unknown): string {
  if (!value) return '未知';
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? '未知' : new Intl.DateTimeFormat('zh-CN', {year: 'numeric', month: 'numeric', day: 'numeric'}).format(date);
}

function skillTags(resource: Resource): string[] {
  const excluded = new Set([
    resource.subcategory,
    'skill',
    'GitHub',
    String(resource.metadata?.primary_language || ''),
  ]);
  return resource.tags.filter((tag) => !excluded.has(tag)).slice(0, 4);
}

export default function Home(): React.ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const location = useLocation();
  const resourcesApiUrl = typeof siteConfig.customFields?.resourcesApiUrl === 'string' ? siteConfig.customFields.resourcesApiUrl : '';
  const skillsApiUrl = typeof siteConfig.customFields?.skillsApiUrl === 'string' ? siteConfig.customFields.skillsApiUrl : '';
  const initialCategory = categories.some((item) => item.id === new URLSearchParams(location.search).get('category'))
    ? (new URLSearchParams(location.search).get('category') as ResourceCategory)
    : 'modeling';
  const [active, setActive] = useState<ResourceCategory>(initialCategory);
  const [activeSubcategory, setActiveSubcategory] = useState<string>(new URLSearchParams(location.search).get('subcategory') || '');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(initialCategory === 'skills' ? 'popular' : 'latest');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Resource[]>(seedResources);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [total, setTotal] = useState(seedResources.length);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [serverPaginated, setServerPaginated] = useState(Boolean(resourcesApiUrl));
  const current = categories.find((item) => item.id === active) || categories[0];

  useEffect(() => {
    const apiUrl = active === 'skills' ? skillsApiUrl : resourcesApiUrl;
    if (!apiUrl) return;
    let mounted = true;
    const controller = new AbortController();
    const url = new URL(apiUrl, window.location.origin);
    if (active !== 'skills') url.searchParams.set('category', active);
    if (active === 'skills' && activeSubcategory) url.searchParams.set('category', activeSubcategory);
    if (active === 'modeling' && activeSubcategory) url.searchParams.set('subcategory', activeSubcategory);
    url.searchParams.set('page', String(page));
    url.searchParams.set('page_size', String(pageSize));
    if (query.trim()) url.searchParams.set('search', query.trim());
    if (sort) url.searchParams.set('sort', sort);
    setLoading(true);
    fetch(url.toString(), {headers: {Accept: 'application/json'}, signal: controller.signal})
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<Resource[] | ResourceResponse | SkillResponse | {data?: Resource[] | ResourceResponse | SkillResponse}>;
      })
      .then((payload) => {
        if (!mounted) return;
        const body = 'data' in payload && payload.data ? payload.data : payload;
        if (active === 'skills' && 'categories' in body && Array.isArray(body.categories)) {
          setSkillCategories(body.categories);
        }
        const result = active === 'skills'
          ? getResourceResponse({...(body as SkillResponse), items: ((body as SkillResponse).items || []).map((item) => normalizeSkill(item as unknown as Skill))})
          : getResourceResponse(body as Resource[] | ResourceResponse);
        if (result.items.length > 0 || result.total === 0) {
          setItems(result.items);
          setTotal(result.total);
          setPages(result.pages);
          setServerPaginated(result.serverPaginated);
        }
      })
      .catch(() => {
        // Keep the bundled seed catalog available while the API is unavailable.
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [active, activeSubcategory, page, query, resourcesApiUrl, skillsApiUrl, sort]);

  const fallbackItems = useMemo(
    () => items.filter((item) => item.category === active && (!activeSubcategory || item.subcategory === activeSubcategory) && `${item.title} ${item.summary} ${item.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())),
    [active, activeSubcategory, items, query],
  );
  const hasApi = active === 'skills' ? Boolean(skillsApiUrl) : Boolean(resourcesApiUrl);
  const visible = hasApi && serverPaginated ? items : (hasApi ? items : fallbackItems).slice((page - 1) * pageSize, page * pageSize);
  const visibleTotal = hasApi ? (serverPaginated ? total : items.length) : fallbackItems.length;
  const visiblePages = hasApi ? (serverPaginated ? pages : Math.max(1, Math.ceil(items.length / pageSize))) : Math.max(1, Math.ceil(fallbackItems.length / pageSize));
  const defaultSort = active === 'skills' ? 'popular' : 'latest';
  const hasActiveFilters = Boolean(query.trim() || activeSubcategory || sort !== defaultSort);

  function selectCategory(category: ResourceCategory) {
    setActive(category);
    setActiveSubcategory('');
    setSort(category === 'skills' ? 'popular' : 'latest');
    setPage(1);
    const url = new URL(window.location.href);
    url.pathname = '/';
    url.searchParams.set('category', category);
    url.searchParams.delete('subcategory');
    window.history.pushState({}, '', `${url.pathname}${url.search}`);
  }

  function selectSubcategory(subcategory: string) {
    setActiveSubcategory(subcategory);
    setPage(1);
    const url = new URL(window.location.href);
    url.pathname = '/';
    url.searchParams.set('category', active);
    if (subcategory) url.searchParams.set('subcategory', subcategory);
    else url.searchParams.delete('subcategory');
    window.history.pushState({}, '', `${url.pathname}${url.search}`);
  }

  function clearFilters() {
    setQuery('');
    setActiveSubcategory('');
    setSort(defaultSort);
    setPage(1);
    const url = new URL(window.location.href);
    url.pathname = '/';
    url.searchParams.set('category', active);
    url.searchParams.delete('subcategory');
    window.history.pushState({}, '', `${url.pathname}${url.search}`);
  }

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const nextCategory = params.get('category');
      const nextSubcategory = params.get('subcategory') || '';
      if (categories.some((item) => item.id === nextCategory)) {
        setActive(nextCategory as ResourceCategory);
      }
      setActiveSubcategory(nextSubcategory);
      setPage(1);
    };
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  return (
    <Layout title="HackStart 资源导航" description="建模、工程、技能与 AI 创作资源导航">
      <main className={styles.shell}>
        <ResourceSidebar activeCategory={active} onCategorySelect={selectCategory} />

        <section className={styles.content}>
          <header className={styles.header}>
            <div>
              <p className={styles.kicker}>HACKSTART RESOURCE LIBRARY</p>
              <h1>{current.label}</h1>
              <p>按来源、时间和关键词筛选，进入详情页查看完整内容。</p>
            </div>
            <Link className={styles.headerAction} to="/docs/codexstart/intro/">
              <span>查看 CodexStart 课程</span><ArrowUpRight aria-hidden="true" />
            </Link>
            <Link className={styles.headerAction} to="/account/">
              <span>进入会员中心</span><Crown aria-hidden="true" />
            </Link>
          </header>

          {active === 'modeling' && <nav className={styles.subcategoryNav} aria-label="Codex案例子分类">
            <button type="button" className={!activeSubcategory ? styles.subcategoryActive : ''} onClick={() => selectSubcategory('')}>全部</button>
            {modelingSubcategories.map((subcategory) => <button type="button" className={activeSubcategory === subcategory ? styles.subcategoryActive : ''} key={subcategory} onClick={() => selectSubcategory(subcategory)}>{subcategory}</button>)}
          </nav>}
          {active === 'skills' && skillCategories.length > 0 && <nav className={styles.subcategoryNav} aria-label="技能分类">
            <button type="button" className={!activeSubcategory ? styles.subcategoryActive : ''} onClick={() => selectSubcategory('')}>全部</button>
            {skillCategories.map((subcategory) => <button type="button" className={activeSubcategory === subcategory.category_key ? styles.subcategoryActive : ''} key={subcategory.category_key} onClick={() => selectSubcategory(subcategory.category_key)}>{subcategory.category_name}<span className={styles.categoryCount}>({subcategory.count})</span></button>)}
          </nav>}

          <div className={styles.toolbar}>
            <label className={styles.search}>
              <Search aria-hidden="true" />
              <input value={query} onChange={(event) => {setQuery(event.target.value); setPage(1);}} placeholder="搜索当前分类" aria-label="搜索当前分类" />
            </label>
            <label className={styles.sort}><span>排序</span><select value={sort} onChange={(event) => {setSort(event.target.value); setPage(1);}} aria-label="资源排序"><option value="latest">最新发布</option><option value="popular">最受欢迎</option><option value="bookmarks">收藏最多</option></select></label>
            <span className={styles.count}>{visibleTotal} 个资源</span>
            {hasActiveFilters && <button type="button" className={styles.clearButton} onClick={clearFilters}><X aria-hidden="true" />清除筛选</button>}
          </div>

          {loading && <div className={styles.loading} aria-live="polite">正在同步资源</div>}
          {loading && visible.length === 0 && <div className={styles.skeletonGrid} aria-label="正在加载资源">{Array.from({length: 6}, (_, index) => <div className={styles.skeletonCard} key={index}><span /><div><b /><i /><i /></div></div>)}</div>}
          <div className={`${styles.grid} ${active === 'skills' ? styles.skillGrid : ''}`} aria-busy={loading}>
            {visible.map((item) => active === 'skills' ? (
              <Link className={`${styles.card} ${styles.skillCard}`} key={item.id} to={resourceDetailPath(item)}>
                <div className={styles.skillMedia}>
                  {resourceImage(item) ? <img src={resourceImage(item)} alt="" loading="lazy" /> : <span className={`${styles.icon} ${styles[item.accent || 'blue']}`}>{item.title.slice(0, 1)}</span>}
                </div>
                <div className={styles.skillCardBody}>
                  <div className={styles.skillMeta}><span>{item.subcategory || '精选技能'}</span><span>{item.authorName || 'HackStart'}</span></div>
                  <h2>{item.title}</h2>
                  <p>{item.summary}</p>
                  <div className={styles.skillInfo}><span><i aria-hidden="true" />{String(item.metadata?.primary_language || '未知')}</span><span>更新于 {formatDate(item.metadata?.github_updated_at || item.publishedAt)}</span></div>
                  {skillTags(item).length > 0 && <div className={styles.skillTags}>{skillTags(item).map((tag) => <span key={tag}>{tag}</span>)}</div>}
                </div>
                <div className={styles.skillStats} aria-label="技能指标">
                  <div><strong>{Math.round(numberValue(item.metadata?.kol_score))}</strong><span>KOL 指数</span></div>
                  <div><strong>{compactNumber(item.metadata?.stars)}</strong><span>Stars</span></div>
                </div>
              </Link>
            ) : (
              <Link className={styles.card} key={item.id} to={resourceDetailPath(item)}>
                <div className={styles.media}>
                  {resourceImage(item) ? <img src={resourceImage(item)} alt="" loading="lazy" /> : <span className={`${styles.icon} ${styles[item.accent || 'blue']}`}>{item.title.slice(0, 1)}</span>}
                  {item.mediaType === 'video' && <span className={styles.mediaBadge}>视频</span>}
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTopline}><span>{item.subcategory || ''}</span><span className={styles.cardSources}><SourceIcon platform={item.sourcePlatform} />{item.githubUrl && <span>GitHub</span>}</span></div>
                  <h2>{item.title}</h2>
                  <p>{item.summary}</p>
                  <div className={styles.cardBottom}><span className={styles.author}><img src={item.authorAvatarUrl || '/img/hackstart.jpeg'} alt="" />{item.authorName || 'HackStart'}</span><span className={styles.arrow} aria-hidden="true"><ArrowUpRight /></span></div>
                </div>
              </Link>
            ))}
          </div>
          {!loading && visible.length === 0 && <div className={styles.empty}><strong>没有找到匹配资源</strong><span>试试换一个关键词，或者清除当前筛选。</span>{hasActiveFilters && <button type="button" onClick={clearFilters}>清除筛选</button>}</div>}
          {visiblePages > 1 && <nav className={styles.pagination} aria-label="资源分页"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>上一页</button><span>第 {page} / {visiblePages} 页</span><button type="button" disabled={page >= visiblePages} onClick={() => setPage((value) => Math.min(visiblePages, value + 1))}>下一页</button></nav>}
        </section>
      </main>
    </Layout>
  );
}
