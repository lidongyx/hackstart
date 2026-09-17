---
displayed_sidebar: usecaseSidebar
sidebar_position: 4
---

# 部署前审查

![Sites 发布前输入与审查](https://md-1251009918.cos.ap-shanghai.myqcloud.com/hackstart/codex-docs/images-codex-sites-prompt-input-light.jpg)

部署前应检查源码变更、数据库迁移、构建结果、saved version、访问范围和环境变量。

## 官方内容整理

- 部署前应检查源码变更、数据库迁移、构建结果、saved version、访问范围和环境变量。
- 保存版本是生成可审查候选；部署版本才会发布生产 URL。
- 部署成功后应确认部署状态和最终 URL。
- 如果扩大访问范围，应先审查内容、数据处理和目标受众。

## 实践补充

- 不要把未审查版本直接发布。
- 部署后做一次冒烟检查。
- 变更访问范围前，先确认页面没有内部信息泄露。

## 推荐工作流

1. 先明确任务目标、输入来源和允许 Codex 使用的工具。
2. 让 Codex 输出计划、风险边界和需要你确认的问题。
3. 从小范围样例开始，确认方向后再扩大。
4. 要求 Codex 保留证据、文件路径、截图、命令输出或验证结果。
5. 对发送、删除、付款、发布、提交、部署等动作保持人工确认。

## 示例提示词

```text
请在部署 Sites 前做一次发布审查。检查 source diff、构建版本、数据库迁移、环境变量、访问范围和部署后验证步骤。不要部署，先输出审查结论。
```

