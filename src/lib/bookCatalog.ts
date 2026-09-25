export type BookAccessMode = 'public' | 'member';

export type BookDefinition = {
  code: string;
  docsPath: string;
  title: string;
  summary: string;
  category: string;
  categoryKey: 'foundation' | 'creation' | 'interaction';
  position: number;
  accessMode: BookAccessMode;
};

export const bookCatalog: readonly BookDefinition[] = [
  {
    code: 'codexstart',
    docsPath: 'codexstart',
    title: 'CodexStart 零基础课程',
    summary: '从第一次对话、任务卡和 Agent 工作方式开始，建立一套可复用的 Codex 基础工作流。',
    category: '入门与基础',
    categoryKey: 'foundation',
    position: 1,
    accessMode: 'member',
  },
  {
    code: 'codex-knowledge-base',
    docsPath: 'codex-knowledge-base',
    title: 'Codex 与知识库',
    summary: '把散落的文件、网页和经验整理成可检索、可维护、可持续更新的个人知识库。',
    category: '入门与基础',
    categoryKey: 'foundation',
    position: 2,
    accessMode: 'member',
  },
  {
    code: 'codex-office',
    docsPath: 'codex-office',
    title: 'Codex 与办公软件',
    summary: '从文档、表格、演示文稿到会议纪要，搭建一套可以反复执行的办公自动化流程。',
    category: '入门与基础',
    categoryKey: 'foundation',
    position: 3,
    accessMode: 'member',
  },
  {
    code: 'codex-video-editing',
    docsPath: 'codex-video-editing',
    title: 'Codex 与视频剪辑',
    summary: '让 Codex 参与素材整理、粗剪规划、字幕校对和版本复盘，提升剪辑交付效率。',
    category: '内容创作',
    categoryKey: 'creation',
    position: 4,
    accessMode: 'member',
  },
  {
    code: 'codex-image-generation',
    docsPath: 'codex-image-generation',
    title: 'Codex 与图片生成',
    summary: '从视觉 brief、提示词系统到批量变体和交付检查，构建稳定的图片生成工作流。',
    category: '内容创作',
    categoryKey: 'creation',
    position: 5,
    accessMode: 'member',
  },
  {
    code: 'codex-video-production',
    docsPath: 'codex-video-production',
    title: 'Codex 与视频制作',
    summary: '从脚本、分镜、配音到渲染与发布，把一次性视频制作变成可复用的工程流程。',
    category: '内容创作',
    categoryKey: 'creation',
    position: 6,
    accessMode: 'member',
  },
  {
    code: 'codex-3d-modeling',
    docsPath: 'codex-3d-modeling',
    title: 'Codex 与 3D 模型',
    summary: '用 Codex 组织建模需求、脚本化场景、材质灯光和导出检查，形成可复现的 3D 管线。',
    category: '空间与互动',
    categoryKey: 'interaction',
    position: 7,
    accessMode: 'member',
  },
  {
    code: 'codex-game-development',
    docsPath: 'codex-game-development',
    title: 'Codex 与游戏开发',
    summary: '从玩法拆解到原型、调试、测试和发布，让 Codex 成为游戏开发中的协作队友。',
    category: '空间与互动',
    categoryKey: 'interaction',
    position: 8,
    accessMode: 'member',
  },
];

export const bookCategoryGroups = [
  {key: 'foundation' as const, label: '入门与基础'},
  {key: 'creation' as const, label: '内容创作'},
  {key: 'interaction' as const, label: '空间与互动'},
];

export function bookEntryPath(book: Pick<BookDefinition, 'docsPath'>) {
  return `/docs/${book.docsPath}/intro/`;
}
