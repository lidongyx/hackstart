---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 9
---

# Product Design 插件

Product Design 属于 role-specific 官方插件方向，适合把 Codex 从“代码执行者”扩展成“产品设计合作者”。它通常用于产品 UI、交互、视觉探索和设计到代码之间的工作。

## 适合场景

- 从一句产品想法生成界面方案。
- 审查现有页面的 UX 问题。
- 根据截图或图片实现前端界面。
- 生成多个设计方向供选择。
- 结合 Figma 或代码库推进产品原型。

## 典型提示词

```text
@Product Design
请审查这个设置页的 UX，指出信息层级、操作路径和视觉密度的问题，并给出可落地修改建议。
```

```text
@Product Design
请把这个产品想法转成一个可实现的首屏界面方案，先说明目标用户、核心动作和页面结构。
```

## 和 Figma 技能的区别

Product Design 更偏产品判断、界面策略和视觉方案。Figma 技能更偏读取设计稿、生成 Figma 画布或把 Figma 实现成代码。真实项目里常常组合使用：

1. Product Design 先确定方向。
2. Figma 相关技能读取或创建设计稿。
3. Codex 再实现代码并用 Browser 验证。

## 风险边界

Product Design 给出的方案不一定自动符合你的品牌规范。落地前要补充：

- 目标用户。
- 产品定位。
- 现有设计系统。
- 禁用的风格。
- 必须复用的组件。

不要让它凭空改完整站视觉，先从一个页面或一个流程开始。
