---
displayed_sidebar: usecaseSidebar
sidebar_position: 1
---

# Sites 概览

![Sites 从提示词创建站点](https://md-1251009918.cos.ap-shanghai.myqcloud.com/hackstart/codex-docs/images-codex-sites-prompt-input-light.jpg)

Sites 让 Codex 创建、保存、部署和检查托管网站、Web 应用和游戏。

## 官方内容整理

- Sites 让 Codex 创建、保存、部署和检查托管网站、Web 应用和游戏。
- 每个 Sites deployment URL 都是生产部署；如果要先审查，应保存版本但暂不部署。
- Sites 项目会把本地源码和托管项目关联起来，并记录必要绑定。
- 适合把 prompt 或兼容现有项目变成托管站点，而不单独配置部署流程。

## 实践补充

- 先保存可审查版本，再决定是否部署。
- 站点分享前确认访问范围和密钥。
- 把 Sites 用作小型应用、内部工具、游戏和 landing page 的快速发布流程。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请用 Sites 为这个内部工具创建一个可审查版本。先不要部署公开 URL。说明项目结构、构建方式、是否需要数据库或文件存储，以及部署前检查清单。
```

