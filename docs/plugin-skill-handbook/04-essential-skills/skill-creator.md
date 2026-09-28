---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 2
---

# skill-creator

`skill-creator` 是最值得先学的系统技能。它帮你把重复工作变成 Codex 可复用的流程。

## 什么时候用

- 你发现自己反复写同一段长 Prompt。
- 某个任务总有固定步骤和验证命令。
- 你希望 Codex 自动判断什么时候使用这套方法。
- 团队想把经验沉淀成可维护文件。

## 典型提示词

```text
$skill-creator
我想创建一个 Docusaurus 文档站维护技能。它应该在修改 docs 目录时触发，要求先读 AGENTS.md，改完运行 pnpm typecheck 和 pnpm build。
```

## 好 skill 的标准

- 触发场景清晰。
- 不触发场景也写清楚。
- 步骤可执行。
- 验证命令明确。
- 参考资料不要一次性塞进主文件，长资料放 references。
- 能用脚本解决的重复检查放 scripts。

## 最小结构

```text
my-skill/
  SKILL.md
```

`SKILL.md` 至少包含：

```md
---
name: my-skill
description: 说明什么时候使用这个技能。
---

具体操作步骤。
```

当 skill 稳定后，再考虑用 `plugin-creator` 打包。
