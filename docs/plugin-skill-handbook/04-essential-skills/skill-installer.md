---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 4
---

# skill-installer

`skill-installer` 用来安装官方 curated skills 或其他 GitHub 仓库里的技能。

## 什么时候用

- 想查看有哪些官方 curated skills。
- 想安装某个已有 skill。
- 想从其他仓库安装技能。
- 想在弱网环境里理解技能目录应该放在哪里。

## 典型提示词

```text
$skill-installer
请列出可安装的 curated skills。
```

```text
$skill-installer linear
```

## 弱网提示

如果不能访问 GitHub，可以先下载仓库 zip，再把目标 skill 目录放到 `~/.agents/skills`。
