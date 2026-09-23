import React, {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import Layout from '@theme/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import ResourceSidebar from '@site/src/components/resources/ResourceSidebar';
import {categories, categoryLabel, normalizeResource, normalizeSkill, resourceImage, seedResources, type Resource, type ResourceCategory, type Skill} from '@site/src/lib/resources';
import styles from './styles.module.css';

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).map((item) => item.trim()).filter(Boolean) : [];
}

function skillImageUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === 'string') return item;
      if (!item || typeof item !== 'object') return '';
      const record = item as Record<string, unknown>;
      return String(record.public_url || record.asset_url || record.url || record.image_url || record.source_url || '');
    })
    .filter(Boolean);
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
  return Number.isNaN(date.getTime()) ? '未知' : new Intl.DateTimeFormat('zh-CN', {year: 'numeric', month: 'long', day: 'numeric'}).format(date);
}

function skillMetric(resource: Resource, key: string): unknown {
  return resource.metadata?.[key];
}

export default function ResourceDetail(): React.ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get('category') || 'modeling';
  const id = params.get('id') || '';
  const resourcesApiUrl = typeof siteConfig.customFields?.resourcesApiUrl === 'string' ? siteConfig.customFields.resourcesApiUrl : '';
  const skillsApiUrl = typeof siteConfig.customFields?.skillsApiUrl === 'string' ? siteConfig.customFields.skillsApiUrl : '';
  const apiUrl = category === 'skills' ? skillsApiUrl : resourcesApiUrl;
  const [resource, setResource] = useState<Resource | null>(seedResources.find((item) => String(item.id) === id) || null);
  const [loading, setLoading] = useState(Boolean(apiUrl && id));

  useEffect(() => {
    if (!apiUrl || !id) return;
    let mounted = true;
    setLoading(true);
    fetch(`${apiUrl.replace(/\/$/, '')}/${encodeURIComponent(id)}`, {headers: {Accept: 'application/json'}})
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<Resource | {data?: Resource}>;
      })
      .then((payload) => {
        if (!mounted) return;
        const raw = payload as unknown as Record<string, unknown>;
        const next = raw.skill || raw.data || payload;
        if (category === 'skills' && typeof next === 'object' && next !== null && 'full_name' in next) setResource(normalizeSkill(next as unknown as Skill));
        else if (typeof next === 'object' && next !== null && 'title' in next) setResource(normalizeResource(next as unknown as Resource));
      })
      .catch(() => {
        return fetch(`${apiUrl}?${category === 'skills' ? '' : `category=${encodeURIComponent(category)}&`}page=1&page_size=100`, {headers: {Accept: 'application/json'}})
          .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json() as Promise<{items?: Array<Resource | Skill>} | Array<Resource | Skill>>;
          })
          .then((payload) => {
            if (!mounted) return;
            const items = Array.isArray(payload) ? payload : payload.items || [];
            const match = items.find((item) => String(item.id) === id || ('slug' in item && item.slug === id) || String((item as unknown as Skill).skill_id) === id);
            if (match) setResource(category === 'skills' ? normalizeSkill(match as unknown as Skill) : normalizeResource(match));
          })
          .catch(() => {
            // Keep the bundled entry or not-found state when both API paths are unavailable.
          });
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [apiUrl, category, id]);

  if (loading && !resource) {
    return <Layout title="资源加载中"><main className={styles.page}><Link to="/">← 返回资源库</Link><h1>正在加载资源</h1><p>正在同步资源详情。</p></main></Layout>;
  }

  if (!resource) {
    return <Layout title="资源不存在"><main className={styles.page}><Link to="/">← 返回资源库</Link><h1>资源不存在</h1><p>这条资源可能已经下线或尚未同步。</p></main></Layout>;
  }

  const image = resourceImage(resource);
  const promptStatus = resource.metadata?.source_prompt_status == null ? '' : String(resource.metadata.source_prompt_status);
  const beginnerSteps = stringList(resource.metadata?.beginner_steps);
  const outcomes = stringList(resource.metadata?.outcomes);
  const useCases = stringList(resource.metadata?.use_cases);
  const skillImages = skillImageUrls(resource.metadata?.readme_images);
  const hasVideo = Boolean(resource.videoUrl);

  if (category === 'skills') {
    const topics = resource.tags;
    return (
      <Layout title={resource.title} description={resource.summary}>
        <main className={styles.shell}>
          <ResourceSidebar activeCategory="skills" />
          <section className={styles.skillPage}>
            <Link className={styles.skillBackLink} to="/resources/?category=skills">← 返回 Skill Atlas</Link>
            <article className={styles.skillHero}>
              <div className={styles.skillIdentity}>
                <img className={styles.skillAvatar} src={resource.authorAvatarUrl || '/img/hackstart.jpeg'} alt="" />
                <div className={styles.skillIdentityCopy}>
                  <p className={styles.skillEyebrow}>{resource.subcategory || '精选技能'} <span>·</span> SKILL PROFILE</p>
                  <h1>{resource.title}</h1>
                  <p className={styles.skillSubtitle}>{resource.summary || '中文简介整理中'}</p>
                  <div className={styles.skillActions}>
                    {resource.href && <a className={styles.skillPrimaryButton} href={resource.href} target="_blank" rel="noreferrer">打开 GitHub ↗</a>}
                    <span className={styles.skillOwner}>@{resource.authorName || 'HackStart'}</span>
                  </div>
                </div>
              </div>
              <div className={styles.skillMetrics}>
                <div><strong>{compactNumber(skillMetric(resource, 'stars'))}</strong><span>Stars</span></div>
                <div><strong>{compactNumber(skillMetric(resource, 'forks'))}</strong><span>Forks</span></div>
                <div><strong>{Math.round(numberValue(skillMetric(resource, 'kol_score')))}</strong><span>KOL 指数</span></div>
              </div>
            </article>
            <div className={styles.readmeLayout}>
              <main className={styles.readmeContent}>
                <div className={styles.readmeHeading}><span>项目 README 中文整理版</span></div>
                <div className={styles.markdown}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({node: _node, ...props}) => <a {...props} target="_blank" rel="noreferrer" />,
                      img: ({node: _node, alt, ...props}) => <img {...props} alt={alt || 'README 插图'} loading="lazy" />,
                    }}>
                    {resource.body || 'README 中文版正在整理。'}
                  </ReactMarkdown>
                </div>
              </main>
              <aside className={styles.detailAside}>
                <section className={styles.asideBlock}>
                  <div className={styles.skillSectionLabel}>项目资料</div>
                  <dl className={styles.projectFacts}>
                    <div><dt>主要语言</dt><dd>{String(skillMetric(resource, 'primary_language') || '未知')}</dd></div>
                    <div><dt>最近更新</dt><dd>{formatDate(skillMetric(resource, 'github_updated_at'))}</dd></div>
                    <div><dt>README 图片</dt><dd>{skillImages.length}</dd></div>
                  </dl>
                </section>
                {topics.length > 0 && <section className={styles.asideBlock}>
                  <div className={styles.skillSectionLabel}>项目标签</div>
                  <div className={styles.skillTagList}>{topics.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </section>}
              </aside>
            </div>
          </section>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title={resource.title} description={resource.summary}>
      <main className={styles.shell}>
        <ResourceSidebar activeCategory={categories.some((item) => item.id === category) ? category as ResourceCategory : undefined} />
        <section className={styles.content}>
          <div className={styles.topbar}><Link to="/">← 返回资源库</Link><span>{loading ? '正在同步' : categoryLabel(category)}</span></div>
          <article className={styles.article}>
          <header className={styles.header}>
            <p className={styles.kicker}>{resource.subcategory || categoryLabel(resource.category)}</p>
            <h1>{resource.title}</h1>
            <p className={styles.summary}>{resource.summary}</p>
            <div className={styles.authorRow}>
              <img src={resource.authorAvatarUrl || '/img/hackstart.jpeg'} alt="" />
              <div><strong>{resource.authorName || 'HackStart'}</strong><small>{resource.sourcePlatform ? `${resource.sourcePlatform.toUpperCase()} 来源` : '公开来源'}</small></div>
              {resource.authorUrl && <Link to={resource.authorUrl}>作者主页 ↗</Link>}
            </div>
          </header>
          {hasVideo ? <div className={styles.videoMedia}><video className={styles.heroMedia} controls preload="metadata" poster={resource.posterUrl || image}><source src={resource.videoUrl} />您的浏览器不支持视频播放。</video><div className={styles.videoActions}><a href={resource.videoUrl} download>下载视频</a></div></div> : image ? <img className={styles.heroMedia} src={image} alt="" /> : null}
          <div className={styles.body}>
            <div className={styles.markdown}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({node: _node, ...props}) => <a {...props} target="_blank" rel="noreferrer" />,
                  img: ({node: _node, alt, ...props}) => <img {...props} alt={alt || 'README 插图'} loading="lazy" />,
                }}>
                {resource.body}
              </ReactMarkdown>
            </div>
            {beginnerSteps.length > 0 && <section className={styles.detailSection}><h2>入门步骤</h2><ol>{beginnerSteps.map((step, index) => <li key={`${resource.id}-step-${index}`}>{step}</li>)}</ol></section>}
            {outcomes.length > 0 && <section className={styles.detailSection}><h2>预期结果</h2><ul>{outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></section>}
            {useCases.length > 0 && <section className={styles.detailSection}><h2>使用场景</h2><ul>{useCases.map((useCase) => <li key={useCase}>{useCase}</li>)}</ul></section>}
            {resource.takeaway && <aside><strong>来源摘要</strong><p>{resource.takeaway}</p></aside>}
            {promptStatus && <aside><strong>Prompt 状态</strong><p>{promptStatus}。公开原文只在资料明确提供时展示；否则这里是可复用的技术提示词框架，不代表作者逐字原 Prompt。</p></aside>}
            {resource.tags.length > 0 && <div className={styles.tags}>{resource.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
            {skillImages.length > 0 && <section className={styles.detailSection}><h2>README 图片</h2><div className={styles.imageGrid}>{skillImages.map((url) => <a href={url} target="_blank" rel="noreferrer" key={url}><img src={url} alt="README 插图" loading="lazy" /></a>)}</div></section>}
          </div>
          <div className={styles.sourceLinks}>
            {resource.sourceUrl && <a className={styles.sourceLink} href={resource.sourceUrl} target="_blank" rel="noreferrer">查看原始来源 <span>↗</span></a>}
            {resource.href && resource.href !== resource.sourceUrl && <a className={styles.secondarySourceLink} href={resource.href} target="_blank" rel="noreferrer">打开演示或项目 <span>↗</span></a>}
            {resource.githubUrl && <a className={styles.secondarySourceLink} href={resource.githubUrl} target="_blank" rel="noreferrer">GitHub 开源仓库 <span>↗</span></a>}
            {resource.videoSourceUrl && resource.videoSourceUrl !== resource.videoUrl && <a className={styles.secondarySourceLink} href={resource.videoSourceUrl} target="_blank" rel="noreferrer">视频原始链接 <span>↗</span></a>}
            {resource.referenceSources?.filter((source) => source.url).map((source) => <a className={styles.secondarySourceLink} href={source.url} target="_blank" rel="noreferrer" key={`${source.label || source.type || 'source'}-${source.url}`}>{source.label || source.type || '参考来源'} <span>↗</span></a>)}
          </div>
          </article>
        </section>
      </main>
    </Layout>
  );
}
