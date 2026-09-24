export type DocLibrarySection = string;

export const docLibrarySections: Record<DocLibrarySection, {
  label: string;
  title: string;
  description: string;
  introPath: string;
}> = {
  integration: {
    label: '接入指引',
    title: 'HackStart API 接入指引',
    description: '从账号、API Key 到 Codex、聊天客户端、编辑器插件和本地 Agent，按你的使用方式选择文章。',
    introPath: '/docs/integration/intro/',
  },
  usecase: {
    label: 'Codex案例',
    title: 'Codex 官方教程与用户案例',
    description: '按能力主题和真实工作场景浏览 Codex 教程，找到适合当前任务的实践文章。',
    introPath: '/docs/usecase/intro/',
  },
  'plugin-skill-handbook': {
    label: '插件与技能小册',
    title: '插件与技能实践小册',
    description: '系统了解插件、技能、MCP、配置与常用工作流，并进入对应专题继续阅读。',
    introPath: '/docs/plugin-skill-handbook/intro/',
  },
  codexstart: {
    label: 'CodexStart 零基础课程',
    title: 'CodexStart 零基础课程',
    description: '从第一次使用开始，逐步掌握 Codex、Agent、插件、浏览器与办公自动化的实践方法。',
    introPath: '/docs/codexstart/intro/',
  },
  'codex-knowledge-base': {
    label: 'Codex 与知识库',
    title: 'Codex 与知识库',
    description: '把文件、网页和经验整理成可检索、可维护、可以持续更新的个人知识库。',
    introPath: '/docs/codex-knowledge-base/intro/',
  },
  'codex-office': {
    label: 'Codex 与办公软件',
    title: 'Codex 与办公软件',
    description: '从文档、表格、演示文稿到会议纪要，搭建一套可以反复执行的办公自动化流程。',
    introPath: '/docs/codex-office/intro/',
  },
  'codex-video-editing': {
    label: 'Codex 与视频剪辑',
    title: 'Codex 与视频剪辑',
    description: '让 Codex 参与素材整理、粗剪规划、字幕校对和版本复盘，提升剪辑交付效率。',
    introPath: '/docs/codex-video-editing/intro/',
  },
  'codex-image-generation': {
    label: 'Codex 与图片生成',
    title: 'Codex 与图片生成',
    description: '从视觉 brief、提示词系统到批量变体和交付检查，构建稳定的图片生成工作流。',
    introPath: '/docs/codex-image-generation/intro/',
  },
  'codex-video-production': {
    label: 'Codex 与视频制作',
    title: 'Codex 与视频制作',
    description: '从脚本、分镜、配音到渲染与发布，把一次性视频制作变成可复用的工程流程。',
    introPath: '/docs/codex-video-production/intro/',
  },
  'codex-3d-modeling': {
    label: 'Codex 与 3D 模型',
    title: 'Codex 与 3D 模型',
    description: '用 Codex 组织建模需求、脚本化场景、材质灯光和导出检查，形成可复现的 3D 管线。',
    introPath: '/docs/codex-3d-modeling/intro/',
  },
  'codex-game-development': {
    label: 'Codex 与游戏开发',
    title: 'Codex 与游戏开发',
    description: '从玩法拆解到原型、调试、测试和发布，让 Codex 成为游戏开发中的协作队友。',
    introPath: '/docs/codex-game-development/intro/',
  },
};

export function getDocLibrarySection(value: string): DocLibrarySection | undefined {
  const normalized = value.replace(/^\/docs\//, '').replace(/^\/+/, '');
  const parts = normalized.replace(/\/$/, '').split('/');
  const section = parts[0] || '';
  // Workshop documents are a separate practice system. They must not inherit
  // the member-course sidebar or CourseAccessGate used by the course library.
  return docLibrarySections[section] ? section : undefined;
}

export function isDocLibraryIntro(id: string): boolean {
  const section = getDocLibrarySection(id);
  return section ? id === `${section}/intro` || id === `${section}/info` : false;
}
