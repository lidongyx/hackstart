---
displayed_sidebar: usecaseSidebar
sidebar_position: 1
---

# Skills 概览

Skills 是 Codex 可复用的任务工作流。它们告诉 Codex 在特定任务中应该按什么步骤做、读哪些参考、用哪些脚本、如何验证。

## 官方内容整理

- Skills 是 Codex 可复用的任务工作流。它们告诉 Codex 在特定任务中应该按什么步骤做、读哪些参考、用哪些脚本、如何验证。
- Skill 通常包含 SKILL.md，也可以包含 references、scripts、assets 和模板。
- Skills 可以来自个人、项目、团队或插件。
- Codex App、CLI 和 IDE Extension 都可以使用 agent skills。

## 实践补充

- 把重复任务沉淀为 skill，而不是每次重新写长提示词。
- SKILL.md 负责工作方法，references 负责长资料，scripts 负责可执行辅助。
- 技能越聚焦，触发越准确。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请把这个重复工作流整理成 Codex Skill。包含触发场景、操作步骤、参考文件、可复用脚本、验证命令和输出格式。
```

