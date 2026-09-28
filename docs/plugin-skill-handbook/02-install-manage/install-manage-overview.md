---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 1
---

# 安装与管理总览

安装插件和技能之前，先确认你到底要安装哪一类东西。

## 插件安装

常用命令：

```bash
codex plugin marketplace list
codex plugin list
codex plugin marketplace add owner/repo --ref main
codex plugin add plugin-name@marketplace-name
```

插件安装后，建议开新线程测试。涉及外部 App 的插件，还需要完成对应应用的授权。

## 技能安装

技能有三种来源：

- Codex 系统内置技能，例如 `skill-creator`、`plugin-creator`、`openai-docs`。
- 插件自带技能，安装插件后自动出现。
- 用户自己放到 `~/.agents/skills` 或项目 `.agents/skills` 下的技能。

技能更新后如果没有出现，重启 Codex 或新开线程。

## 管理原则

- 不确定是否需要，就先不要装。
- 能用一个 skill 解决，就不要急着做 plugin。
- 外部 App 插件要先想清楚数据权限。
- 团队共享前先写清楚适用场景、禁用场景和验证方式。
- 弱网环境优先使用 zip 和本地 marketplace。
