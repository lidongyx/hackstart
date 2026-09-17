---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 2
---

# 插件和技能的关系

技能是工作流，插件是分发包。理解这句话，基本就能避免大多数安装和使用上的混乱。

## Skill 是什么

Skill 是一个目录，核心文件是 `SKILL.md`。它告诉 Codex：

- 什么时候应该使用这个技能。
- 任务应该按什么步骤做。
- 需要读哪些参考文件。
- 可以运行哪些脚本。
- 最后应该怎么验证和交付。

Skill 的优势是轻、直接、适合沉淀方法。比如“审查 PDF 布局”“用 Figma 设计稿实现前端页面”“部署到 Vercel”，都适合做成 skill。

## Plugin 是什么

Plugin 是一个可安装包。它可以包含：

- 一个或多个 skills。
- MCP server 配置。
- App Connector 映射。
- 图标、展示名、默认提示词等界面信息。
- 团队或 marketplace 分发元数据。

当你只是在自己电脑上复用一个流程，skill 就够了。当你希望别人也能安装，或者一套能力包含 skill、MCP 和外部 App 授权，就应该做成 plugin。

## 为什么装了插件就会多出技能

很多插件本质上就是一组 skills 加一些附加能力。比如一个部署插件可能带有部署前检查、环境变量审查、预览发布、生产发布几个 skills。安装插件后，这些 skill 会进入 Codex 的可用能力列表。

## 什么时候不要做插件

这些情况先不要做插件：

- 任务还没跑通，只是一个想法。
- 流程每天都在变。
- 只有你自己在一个仓库里使用。
- 只是想让 Codex 记住几条项目规则。

先写 Prompt 或 AGENTS.md，稳定后再提炼 skill，最后再考虑 plugin。这个顺序更可靠。
