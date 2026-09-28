---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 3
---

# plugin-creator

`plugin-creator` 用来创建 Codex 插件。它适合把已经稳定的技能、脚本、MCP 配置和展示信息打包，方便自己或团队安装。

## 什么时候用

- 一个 skill 已经多人复用。
- 你希望把多个 skills 放在一起分发。
- 你要同时分发 MCP server 配置。
- 你想给插件设置展示名、图标、分类和默认 Prompt。
- 团队需要一个本地 marketplace。

## 典型提示词

```text
$plugin-creator
请把这个 docs-maintainer skill 打包成个人插件，插件名 docs-maintainer，默认放在 ~/plugins 里，并生成本地 marketplace。
```

## 插件最小结构

```text
my-plugin/
  .codex-plugin/
    plugin.json
  skills/
    my-skill/
      SKILL.md
```

`plugin.json` 里最重要的是：

- `name`
- `version`
- `description`
- `skills`
- `interface.displayName`

## 实践建议

先让 skill 在真实任务中跑几次，再打包成 plugin。插件一旦被别人安装，就需要考虑版本、兼容性和说明文档。
