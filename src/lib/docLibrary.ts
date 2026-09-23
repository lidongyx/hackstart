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
  return section ? id === `${section}/intro` : false;
}
