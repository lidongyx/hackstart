---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 11
---

# Vercel 插件

Vercel 插件适合围绕 Vercel 生态构建和部署 Web 应用，尤其是 Next.js、AI SDK、Turborepo 和边缘部署相关项目。

## 适合场景

- 审查项目是否适合部署到 Vercel。
- 生成或修复 Vercel 部署配置。
- 排查构建失败。
- 处理环境变量、预览部署、生产部署流程。
- 结合 Vercel App Connector 读取项目上下文。

## 典型提示词

```text
请使用 Vercel 插件审查这个仓库的部署风险，列出需要改的配置和验证命令。
```

```text
请帮我准备一次 Vercel preview deploy。不要发布 production，先输出部署计划和风险。
```

## 实践建议

部署相关任务默认先做 preview。除非你明确要求生产发布，否则让 Codex 不要碰 production。

部署前至少检查：

- 构建命令。
- 输出目录。
- Node 版本。
- 环境变量。
- 路由和重写。
- 生产域名和缓存策略。
