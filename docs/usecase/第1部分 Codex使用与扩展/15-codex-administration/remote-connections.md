---
displayed_sidebar: usecaseSidebar
sidebar_position: 4
---

# Remote connections 远程连接

Remote connections 让你从另一台设备控制 Codex：可以用手机查看和推进桌面端任务，也可以让 Codex App 连接 SSH 主机上的项目。

## 官方内容整理

- 远程连接会复用被连接主机上的项目、线程、文件、凭证、权限、插件、浏览器、Computer Use 和本地工具。
- 你可以远程创建新线程、继续已有线程、发送补充指令、回答问题、审批命令、查看输出、查看 diff、看测试结果和截图。
- 移动端远程控制支持 macOS 和 Windows 上的 Codex App host。设置入口在 Codex App，不在 CLI 或 IDE 扩展。
- 手机端需要安装最新 ChatGPT 移动 App，并登录同一 ChatGPT 账号和工作区。
- 被控电脑需要在线、唤醒、已登录 Codex，并处在可被远程访问的状态。企业工作区可能需要管理员先启用 Remote Control。
- 设置移动端访问时，先在 Codex App 里启动移动端设置流程，再用手机扫描二维码完成绑定。
- 连接后可以在 Settings 的 Connections 中管理设备，配置是否保持唤醒、是否启用 Computer Use、是否安装 Chrome 扩展。
- 可以连接日常使用的笔记本，也可以连接一台常开机器，让 Codex 长时间可达。
- 对已有远程开发环境，可以在 Codex App 中添加 SSH host，让 Codex 在线程中直接读取和修改远程文件系统。
- SSH 方式依赖本机 OpenSSH 配置中的具体 host alias。Codex 会通过 SSH 启动远程 Codex app server。
- 不应把 app-server transport 直接暴露到共享或公网网络。跨网络访问应优先使用 VPN、内网或 mesh 网络。

## 实践补充

远程连接不是“把 Codex 搬到云上”，而是把控制入口从当前设备扩展到另一台设备。真正执行命令、读取文件、使用登录态的仍然是被连接主机。因此排查问题时要回到 host 看：项目是否存在、依赖是否安装、凭证是否可读、沙盒配置是否允许。

手机远程控制适合审批、查看进度、补充说明和启动已有项目中的轻量任务。需要密集浏览器操作、桌面交互或长时间本地构建时，最好使用常开电脑或远程开发机作为 host。

## 推荐工作流

1. 先选 host：日常电脑、常开桌面机，还是 SSH 开发机。
2. 在 host 上完成项目克隆、依赖安装、Codex 登录、插件和 MCP 配置。
3. 用本地 Codex 跑一次只读任务，确认环境正常。
4. 再启用远程连接或添加 SSH host。
5. 远程推进任务时，要求 Codex 输出当前 host、项目路径、权限模式和将要执行的动作。

## 示例提示词

```text
请帮我设计一套 Codex 远程连接方案。我希望白天在办公室 Mac 上开发，晚上用手机审批和查看任务，另外有一台常开的 Linux 开发机跑长任务。请输出 host 选择、SSH 配置、权限边界和故障排查清单。
```

```text
我已经把 Codex App 连接到 SSH host。请先只读检查远程项目环境，确认当前路径、Git 状态、依赖管理器、测试命令、Codex 权限模式和可能阻塞自动运行的问题。
```
