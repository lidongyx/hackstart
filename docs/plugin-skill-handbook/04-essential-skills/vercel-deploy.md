---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 13
---

# vercel-deploy

`vercel-deploy` 用于 Vercel 应用部署。默认更适合 preview deploy，生产发布需要明确确认。

## 适合场景

- Next.js 项目部署。
- 预览环境发布。
- 检查 Vercel 构建配置。
- 排查部署失败。

## 典型提示词

```text
$vercel-deploy
请把这个项目部署成 Vercel preview，不要发布 production。部署前先检查构建命令和环境变量。
```

## 验证方式

让 Codex 返回 preview URL、构建日志摘要、失败原因或上线检查清单。
