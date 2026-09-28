---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 6
---

# Spreadsheets 插件

Spreadsheets 插件适合处理 Excel、CSV、TSV 和 Google Sheets 风格工作簿。它不是简单“看表格”，而是能生成公式、格式、图表和可交付文件。

## 适合场景

- 清洗 CSV。
- 生成财务模型或预算表。
- 对交易流水做分类汇总。
- 创建带公式和图表的 `.xlsx`。
- 把分析结果做成可交付表格。

## 典型提示词

```text
请使用 Spreadsheets 插件读取这个 CSV，按月份和类别汇总支出，生成一个带图表的 xlsx。
```

```text
请把这份销售数据做成可给团队看的表格，包含透视汇总、异常值标注和说明页。
```

## 验证方式

表格任务最容易出错的是公式和格式。交付前要求 Codex 检查：

- 行数是否一致。
- 数值列是否被识别为数字。
- 公式是否能重新计算。
- 汇总数是否和原始数据对得上。
- 图表是否引用正确范围。
