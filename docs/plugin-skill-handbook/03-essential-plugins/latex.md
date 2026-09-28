---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 18
---

# LaTeX 插件

LaTeX 插件适合编译和修复论文、研究报告、数学公式密集文档。它会优先使用合适的 TeX 工具链，并帮助你定位构建失败原因。

## 适合场景

- 编译 `.tex` 项目。
- 修复 LaTeX 报错。
- 检查引用、图表、公式和 BibTeX。
- 生成正式 PDF。

## 典型提示词

```text
@LaTeX
请检查这个 TeX 项目能否编译，并修复第一个导致构建失败的问题。
```

## 实践建议

一次只修一个主要错误。LaTeX 报错常常连锁出现，先修最早的 fatal error，再重新编译。
