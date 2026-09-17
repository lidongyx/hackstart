---
displayed_sidebar: codexstartSidebar
sidebar_position: 1
description: 区分 Browser、Chrome 和 Playwright，按任务选择正确的浏览器工具。
---

# Browser、Chrome 和 Playwright 怎么选

| 工具 | 适合 | 注意 |
| --- | --- | --- |
| Browser | 快速打开本地页面、点击、截图和检查 | 通常不带你的个人登录状态 |
| Chrome | 使用真实浏览器标签页、Cookie 和扩展 | 能看到更敏感的账户内容 |
| Playwright | 可重复的脚本化浏览器测试 | 需要更明确的选择器和测试步骤 |

## 选择口诀

- 只想看看页面：Browser。
- 必须使用当前登录态：Chrome。
- 想每天重复跑：Playwright。

## 通用浏览器提示词

```text
请打开 http://127.0.0.1:3007/docs/。
只读检查，不提交表单，不修改数据。
依次检查：页面标题、主要导航、侧边栏、文章内容、移动端布局和控制台错误。
输出访问路径、操作步骤、截图位置和发现的问题。
```

## 课后任务

针对一个本地页面分别设计 Browser 检查版和 Playwright 自动化版，比较两者的输入、输出和维护成本。

