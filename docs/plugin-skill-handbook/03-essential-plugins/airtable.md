---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 17
---

# Airtable 插件

Airtable 插件适合把 Codex 接入轻量数据库和运营流程。它既能读写记录，也能帮助设计 base、字段和视图。

## 适合场景

- 建项目管理、CRM、内容排期或招聘 base。
- 查询和更新记录。
- 整理运营数据。
- 从业务流程设计 Airtable schema。

## 典型提示词

```text
@Airtable
请根据这个客户跟进流程设计一个 Airtable base，包括表、字段、视图和自动化建议。
```

## 风险边界

涉及批量更新、删除记录、修改 schema 时，要先让 Codex 输出计划和影响范围，再确认执行。

## 验证方式

让 Codex 列出变更的 base、表、字段、记录数量和回滚建议。
