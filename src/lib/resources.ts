export type ResourceCategory = 'modeling' | 'skills' | 'image' | 'video' | 'official' | 'integration';

export type Resource = {
  id: string | number;
  slug?: string;
  category: ResourceCategory | string;
  subcategory?: string;
  title: string;
  summary: string;
  body: string;
  takeaway?: string;
  tags: string[];
  href?: string;
  imageUrl?: string;
  mediaType?: 'image' | 'video' | 'none' | string;
  videoUrl?: string;
  posterUrl?: string;
  authorName?: string;
  authorAvatarUrl?: string;
  authorUrl?: string;
  sourcePlatform?: 'github' | 'x' | 'website' | string;
  sourceUrl?: string;
  githubUrl?: string;
  videoSourceUrl?: string;
  videoSourcePlatform?: string;
  referenceSources?: Array<{label?: string; url: string; type?: string}>;
  publishedAt?: string;
  evidenceType?: string;
  accent?: string;
  metadata?: Record<string, unknown>;
};

type RawResource = Partial<Resource> & Record<string, unknown>;

export type Skill = {
  id: string | number;
  skill_id?: string | number;
  github_id?: number;
  full_name: string;
  owner_login?: string;
  name?: string;
  html_url?: string;
  description?: string;
  description_zh?: string;
  summary_zh?: string;
  guide_zh?: string;
  readme_zh?: string;
  readme_excerpt?: string;
  primary_language?: string;
  languages?: string[];
  topics?: string[];
  stars?: number;
  forks?: number;
  avatar_url?: string;
  category_key?: string;
  category_name?: string;
  skill_score?: number;
  kol_score?: number;
  readme_images?: Record<string, unknown>[];
  beginner_steps?: string[];
  outcomes?: string[];
  use_cases?: string[];
  keywords?: string[];
  published?: boolean;
  [key: string]: unknown;
};

const legacyResourceAssetBase = 'https://pub-7eb4d463d0794433a7e023fab96126f7.r2.dev';
const resourceAssetBase = 'https://resources.hackstart.org';

export function normalizeResourceAssetUrl(value: unknown): string | undefined {
  if (value == null) return undefined;
  const url = String(value).trim();
  if (!url) return undefined;
  return url.startsWith(`${legacyResourceAssetBase}/`)
    ? `${resourceAssetBase}${url.slice(legacyResourceAssetBase.length)}`
    : url;
}

function resourceAssetKeyUrl(value: unknown): string | undefined {
  const key = String(value ?? '').trim().replace(/^\/+/, '');
  return key ? `${resourceAssetBase}/hackstart/resources/${key}` : undefined;
}

export function normalizeResource(raw: RawResource): Resource {
  const tags = Array.isArray(raw.tags) ? raw.tags.map(String) : [];
  const metadata = raw.metadata && typeof raw.metadata === 'object' ? raw.metadata as Record<string, unknown> : undefined;
  const videoUrl = normalizeResourceAssetUrl(raw.videoUrl ?? raw.video_url ?? raw.videoDownloadUrl ?? raw.video_download_url ?? metadata?.videoUrl ?? metadata?.video_url ?? metadata?.videoDownloadUrl ?? metadata?.video_download_url)
    || resourceAssetKeyUrl(raw.videoKey ?? raw.video_key ?? metadata?.videoKey ?? metadata?.video_key);
  return {
    id: raw.id ?? '',
    slug: raw.slug as string | undefined,
    category: String(raw.category ?? 'modeling'),
    subcategory: raw.subcategory == null ? undefined : String(raw.subcategory),
    title: String(raw.title ?? ''),
    summary: String(raw.summary ?? ''),
    body: String(raw.body ?? raw.summary ?? ''),
    takeaway: raw.takeaway == null ? undefined : String(raw.takeaway),
    tags,
    href: raw.href as string | undefined,
    imageUrl: normalizeResourceAssetUrl(raw.imageUrl ?? raw.image_url),
    mediaType: (raw.mediaType ?? raw.media_type ?? (videoUrl ? 'video' : undefined)) as Resource['mediaType'],
    videoUrl,
    posterUrl: normalizeResourceAssetUrl(raw.posterUrl ?? raw.poster_url)
      || resourceAssetKeyUrl(raw.posterKey ?? raw.poster_key ?? metadata?.posterKey ?? metadata?.poster_key),
    authorName: (raw.authorName ?? raw.author_name) as string | undefined,
    authorAvatarUrl: normalizeResourceAssetUrl(raw.authorAvatarUrl ?? raw.author_avatar_url),
    authorUrl: (raw.authorUrl ?? raw.author_url) as string | undefined,
    sourcePlatform: (raw.sourcePlatform ?? raw.source_platform) as Resource['sourcePlatform'],
    sourceUrl: (raw.sourceUrl ?? raw.source_url) as string | undefined,
    githubUrl: (raw.githubUrl ?? raw.github_url) as string | undefined,
    videoSourceUrl: (raw.videoSourceUrl ?? raw.video_source_url) as string | undefined,
    videoSourcePlatform: (raw.videoSourcePlatform ?? raw.video_source_platform) as string | undefined,
    referenceSources: Array.isArray(raw.referenceSources ?? raw.reference_sources)
      ? (raw.referenceSources ?? raw.reference_sources) as Resource['referenceSources']
      : undefined,
    publishedAt: (raw.publishedAt ?? raw.published_at) as string | undefined,
    evidenceType: (raw.evidenceType ?? raw.evidence_type) as string | undefined,
    accent: raw.accent as string | undefined,
    metadata,
  };
}

export function normalizeSkill(raw: Skill): Resource {
  const tags = [...(raw.keywords || []), ...(raw.topics || []), ...(raw.languages || [])]
    .map(String)
    .filter((value, index, values) => value && values.indexOf(value) === index)
    .slice(0, 16);
  const summary = String(raw.description_zh || raw.summary_zh || raw.description || raw.readme_excerpt || '');
  const metadata = {...raw} as Record<string, unknown>;
  return {
    id: raw.id ?? raw.skill_id ?? raw.github_id ?? raw.full_name,
    slug: raw.full_name,
    category: 'skills',
    subcategory: raw.category_name || raw.category_key,
    title: raw.full_name,
    summary,
    body: String(raw.readme_zh || raw.guide_zh || summary),
    takeaway: raw.readme_excerpt,
    tags,
    href: raw.html_url,
    imageUrl: normalizeResourceAssetUrl(raw.avatar_url),
    mediaType: 'none',
    authorName: raw.owner_login || 'GitHub',
    authorAvatarUrl: normalizeResourceAssetUrl(raw.avatar_url),
    authorUrl: raw.html_url,
    sourcePlatform: 'github',
    sourceUrl: raw.html_url,
    evidenceType: 'repository',
    accent: 'teal',
    metadata,
  };
}

export const categories: Array<{id: ResourceCategory; label: string}> = [
  {id: 'modeling', label: 'Codex案例'},
  {id: 'skills', label: '精选技能'},
];

export const modelingSubcategories = [
  '游戏与可玩原型',
  '3D 空间与建模',
  '界面、网页与产品',
  '视频与动效',
  '工程与硬件',
  '科学、数学与评测',
  'Computer Use / Agent',
  '办公与音乐',
] as const;

export const codexLinks = [
  {id: 'codexstart', label: 'CodexStart 零基础课程', href: '/docs/codexstart/intro/'},
];

export const seedResources: Resource[] = [
  {
    id: 'astra',
    category: 'modeling',
    title: 'GPT-6 Astra 建模与工程',
    summary: '面向真实项目的模型选择、上下文组织与工程落地方法。',
    body: '从需求拆解、上下文准备到验证交付，建立一套可以重复使用的 AI 工程工作流。适合希望把模型能力接入产品、代码仓库或自动化流程的开发者。',
    tags: ['GPT-6 Astra', '工程实践'],
    href: 'https://cheerselfai.com/usecase/gpt-6-astra',
    sourceUrl: 'https://cheerselfai.com/usecase/gpt-6-astra',
    sourcePlatform: 'website',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    authorName: 'Cheerself AI',
    authorAvatarUrl: '/img/hackstart.jpeg',
    authorUrl: 'https://cheerselfai.com/usecase/gpt-6-astra',
    accent: 'violet',
  },
  {
    id: 'codex-project',
    category: 'modeling',
    title: '用 Codex 改造真实仓库',
    summary: '从阅读代码到提交补丁，建立可验证的协作闭环。',
    body: '一份偏实战的仓库改造路径：明确目标、定位模块、保持变更可审查，并用测试和差异确认结果。',
    tags: ['Codex', '软件工程'],
    href: '/docs/codexstart/intro/',
    sourceUrl: '/docs/codexstart/intro/',
    sourcePlatform: 'website',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    authorName: 'HackStart',
    authorAvatarUrl: '/img/hackstart.jpeg',
    authorUrl: '/',
    accent: 'blue',
  },
  {
    id: 'deep-research',
    category: 'skills',
    title: '深度研究与资料整理',
    summary: '把分散资料变成有证据链的结论。',
    body: '适用于竞品分析、技术调研和复杂主题研究。重点是来源、假设、证据和结论之间的可追溯关系。',
    tags: ['研究', '证据链'],
    sourcePlatform: 'website',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
    authorName: 'HackStart',
    authorAvatarUrl: '/img/hackstart.jpeg',
    authorUrl: '/',
    accent: 'teal',
  },
  {
    id: 'security',
    category: 'skills',
    title: '代码安全审查',
    summary: '对仓库、变更和依赖做结构化安全检查。',
    body: '从候选发现、攻击路径到修复验证，帮助工程团队把安全审查变成可重复的流程。',
    tags: ['Security', 'Review'],
    sourcePlatform: 'website',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=80',
    authorName: 'HackStart',
    authorAvatarUrl: '/img/hackstart.jpeg',
    authorUrl: '/',
    accent: 'orange',
  },
  {
    id: 'product-shot',
    category: 'image',
    title: '产品摄影提示词',
    summary: '干净、克制、适合产品展示的商业视觉。',
    body: '以主体、材质、镜头、光线和背景五个维度组织提示词，适合 SaaS、硬件和品牌页面配图。',
    tags: ['产品摄影', '商业视觉'],
    sourcePlatform: 'x',
    sourceUrl: 'https://x.com/',
    imageUrl: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1000&q=80',
    authorName: '@hackstart',
    authorAvatarUrl: '/img/hackstart.jpeg',
    authorUrl: 'https://x.com/hackstart',
    accent: 'pink',
  },
  {
    id: 'editorial',
    category: 'image',
    title: '编辑感人物肖像',
    summary: '适合封面、社交媒体与品牌故事的肖像方向。',
    body: '通过场景关系、姿态和色彩控制，生成更像真实编辑拍摄而不是模板化头像的画面。',
    tags: ['肖像', 'Editorial'],
    sourcePlatform: 'x',
    sourceUrl: 'https://x.com/',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=80',
    authorName: '@hackstart',
    authorAvatarUrl: '/img/hackstart.jpeg',
    authorUrl: 'https://x.com/hackstart',
    accent: 'indigo',
  },
  {
    id: 'storyboard',
    category: 'video',
    title: '短片分镜提示词',
    summary: '从一句想法开始，拆成可执行的镜头序列。',
    body: '包含镜头景别、运动、主体动作、环境变化和声音提示，适合短视频和产品演示的前期创作。',
    tags: ['分镜', 'Storyboard'],
    sourcePlatform: 'x',
    sourceUrl: 'https://x.com/',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=80',
    authorName: '@hackstart',
    authorAvatarUrl: '/img/hackstart.jpeg',
    authorUrl: 'https://x.com/hackstart',
    accent: 'red',
  },
  {
    id: 'motion-design',
    category: 'video',
    title: '产品动效与转场',
    summary: '为 AI 视频生成器准备的镜头级描述。',
    body: '把 UI 动效、镜头运动和节奏写成模型更容易理解的镜头指令，减少成片中主体漂移和动作断裂。',
    tags: ['动效', '镜头语言'],
    sourcePlatform: 'x',
    sourceUrl: 'https://x.com/',
    imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1000&q=80',
    authorName: '@hackstart',
    authorAvatarUrl: '/img/hackstart.jpeg',
    authorUrl: 'https://x.com/hackstart',
    accent: 'cyan',
  },
];

export function categoryLabel(category: string) {
  return categories.find((item) => item.id === category)?.label || '资源';
}

export function resourceDetailPath(resource: Resource) {
  return `/resources/detail/?category=${encodeURIComponent(resource.category)}&id=${encodeURIComponent(String(resource.id))}`;
}

export function resourceImage(resource: Resource) {
  return resource.imageUrl || resource.posterUrl || '';
}
