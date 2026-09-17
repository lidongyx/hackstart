---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 15
---

# render-deploy

`render-deploy` 用于 Render 平台部署，尤其适合生成或检查 `render.yaml` Blueprint。

## 适合场景

- Web service 部署。
- 后端 API 部署。
- 生成 Render Blueprint。
- 分析服务、数据库和环境变量。

## 典型提示词

```text
$render-deploy
请为这个后端项目生成 render.yaml，并说明需要在 Render Dashboard 里确认的环境变量。
```

## 实践建议

Render 部署通常依赖 Git 仓库。没有 Git remote 时，先不要强行部署，先准备仓库和 Blueprint。
