---
displayed_sidebar: pluginSkillHandbookSidebar
sidebar_position: 2
---

# 弱网环境安装官方插件和技能

这一篇是插件与技能小册的第一部分，面向中国大陆 Mac 和 Windows 用户：电脑能登录 Codex，但 GitHub、OpenAI 官方仓库或 npm 下载经常失败，且暂时没有可用 VPN。目标是用尽量稳的方式，把官方插件、官方 role-specific 插件仓库，以及常用 skills 安装到本机。

先分清三个概念：

| 类型 | 用途 | 常见安装方式 |
| --- | --- | --- |
| 插件 Plugin | 把 skills、App 集成和 MCP server 打包成可安装能力 | `codex plugin add 插件名@marketplace名` |
| 插件市场 Marketplace | 一份插件目录，告诉 Codex 去哪里找插件 | `codex plugin marketplace add 来源` |
| 技能 Skill | 可复用任务工作流，通常是一个带 `SKILL.md` 的目录 | 通过插件分发，或放到本机 skills 目录 |

官方手册里的关系可以简单理解为：skills 是工作流本身，plugin 是更适合分发和安装的打包单位；marketplace 则是插件目录。网络不稳定时，核心思路不是反复重试，而是把 marketplace 或 skill 仓库先下载到本地，再让 Codex 从本地路径读取。

## 适用场景

你可能会遇到这些情况：

- `codex plugin marketplace add openai/role-specific-plugins --ref main` 卡住或失败。
- `git clone` 失败，或者提示没有安装 Git。
- GitHub 网页能偶尔打开，但命令行下载经常超时。
- 可以从手机、公司电脑、朋友电脑、云服务器或下载镜像拿到 zip 文件，然后拷贝到本机。
- Codex App 或 Codex CLI 已经能启动，但插件和技能列表不完整。

如果你的网络可以稳定访问 GitHub，优先使用官方命令安装；如果不稳定，直接跳到本地 zip 方案。

## 1. 确认 Codex CLI 可用

Mac 打开“终端”，执行：

```bash
codex --version
```

Windows 打开 PowerShell，执行：

```powershell
$env:Path = "C:\Program Files\nodejs;$env:APPDATA\npm;$env:Path"
codex --version
```

如果 Windows 提示：

```text
codex.ps1 cannot be loaded because running scripts is disabled
```

说明 PowerShell 优先执行了 npm 生成的 `codex.ps1`，但系统禁止脚本。可以改用：

```powershell
codex.cmd --version
```

后续命令里如果 `codex` 不可用，就把 `codex` 替换成 `codex.cmd`。

## 2. 查看本机已有插件市场

Mac：

```bash
codex plugin marketplace list
codex plugin list
```

Windows：

```powershell
codex.cmd plugin marketplace list
codex.cmd plugin list
```

安装插件时使用的是：

```text
插件manifest名@marketplace名
```

不是界面上的展示名。例如展示名可能是 `Product Design`，但真正安装时用的 manifest 名可能是 `product-design`。

## 3. 网络可用时的官方安装方式

OpenAI 官方 role-specific 插件仓库是：

```text
https://github.com/openai/role-specific-plugins
```

常见插件 manifest 名包括：

```text
product-design
sales
data-analytics
financial-markets
```

Mac：

```bash
codex plugin marketplace add openai/role-specific-plugins --ref main
codex plugin marketplace list
codex plugin add product-design@role-specific-plugins
```

Windows：

```powershell
codex.cmd plugin marketplace add openai/role-specific-plugins --ref main
codex.cmd plugin marketplace list
codex.cmd plugin add product-design@role-specific-plugins
```

如果这一步成功，安装就结束了。重启 Codex App 或开一个新线程后，再用插件或它带来的 skill。

## 4. 弱网推荐：先下载 zip，再本地安装 marketplace

如果命令行访问 GitHub 不稳定，可以先在任何能下载的环境里拿到仓库 zip：

```text
https://codeload.github.com/openai/role-specific-plugins/zip/refs/heads/main
```

下载后得到的文件通常叫：

```text
role-specific-plugins-main.zip
```

然后把这个 zip 拷贝到目标电脑。下面分别是 Mac 和 Windows 的展开与安装流程。

### Mac 本地 zip 方案

假设 zip 在 `~/Downloads/role-specific-plugins-main.zip`：

```bash
set -e

ZIP="$HOME/Downloads/role-specific-plugins-main.zip"
BASE="$HOME/.codex/.tmp/role-specific-plugins"
WORK="$HOME/.codex/.tmp/role-specific-plugins-extract"

rm -rf "$WORK" "$BASE"
mkdir -p "$WORK" "$(dirname "$BASE")"
unzip -q "$ZIP" -d "$WORK"

ROOT="$(find "$WORK" -maxdepth 1 -type d -name 'role-specific-plugins-*' | head -n 1)"
mv "$ROOT" "$BASE"

codex plugin marketplace add "$BASE"
codex plugin marketplace list
codex plugin add product-design@role-specific-plugins
```

如果 `unzip` 不存在，可以双击 zip 解压，然后把解压出的 `role-specific-plugins-main` 文件夹拖到：

```text
~/.codex/.tmp/role-specific-plugins
```

再执行：

```bash
codex plugin marketplace add "$HOME/.codex/.tmp/role-specific-plugins"
codex plugin add product-design@role-specific-plugins
```

### Windows 本地 zip 方案

假设 zip 在“下载”目录：

```powershell
$ErrorActionPreference = "Stop"
$env:Path = "C:\Program Files\nodejs;$env:APPDATA\npm;$env:Path"

$zip = Join-Path $env:USERPROFILE "Downloads\role-specific-plugins-main.zip"
$base = Join-Path $env:USERPROFILE ".codex\.tmp\role-specific-plugins"
$extract = Join-Path $env:TEMP "role-specific-plugins-main-extract"

Remove-Item -LiteralPath $extract -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $base -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path $extract | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $base) | Out-Null

tar.exe -xf $zip -C $extract

$root = Get-ChildItem -LiteralPath $extract -Directory | Select-Object -First 1
Move-Item -LiteralPath $root.FullName -Destination $base

codex.cmd plugin marketplace add $base
codex.cmd plugin marketplace list
codex.cmd plugin add product-design@role-specific-plugins
```

如果 `tar.exe` 解压失败，也可以右键 zip 选择“全部解压缩”，然后把解压出的 `role-specific-plugins-main` 文件夹移动到：

```text
C:\Users\你的用户名\.codex\.tmp\role-specific-plugins
```

再执行：

```powershell
codex.cmd plugin marketplace add "$env:USERPROFILE\.codex\.tmp\role-specific-plugins"
codex.cmd plugin add product-design@role-specific-plugins
```

## 5. 安装其他 role-specific 官方插件

本地 marketplace 添加成功后，安装其他插件只需要换插件名：

Mac：

```bash
codex plugin add data-analytics@role-specific-plugins
codex plugin add financial-markets@role-specific-plugins
```

Windows：

```powershell
codex.cmd plugin add data-analytics@role-specific-plugins
codex.cmd plugin add financial-markets@role-specific-plugins
```

验证：

```bash
codex plugin list
```

Windows 如果仍然需要 `codex.cmd`：

```powershell
codex.cmd plugin list
```

看到类似 `product-design@role-specific-plugins installed, enabled`，就说明插件已经安装并启用。

## 6. 技能 skills 的弱网安装思路

技能有两种常见来源：

- 插件自带的 skills：安装插件后自动可用。
- 单独的 skill 目录：一个文件夹里至少有 `SKILL.md`。

如果是官方或别人分享的 skill 仓库，弱网下同样可以用 zip 方案：先下载仓库 zip，拷贝到本机，解压后把需要的 skill 文件夹放到本机 skills 目录。

推荐本机目录：

Mac：

```text
~/.agents/skills/
```

Windows：

```text
C:\Users\你的用户名\.agents\skills\
```

一个最小 skill 目录应该长这样：

```text
my-skill/
  SKILL.md
```

Mac 示例：

```bash
mkdir -p "$HOME/.agents/skills"
cp -R "/path/to/my-skill" "$HOME/.agents/skills/my-skill"
```

Windows 示例：

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.agents\skills" | Out-Null
Copy-Item -Recurse -Force "D:\Downloads\my-skill" "$env:USERPROFILE\.agents\skills\my-skill"
```

放好以后重启 Codex App，或重新打开 Codex CLI。新线程里可以用 `$技能名` 显式调用，也可以直接描述任务，让 Codex 根据 `SKILL.md` 里的 `description` 自动选择。

## 7. 检查 Computer Use 这类内置能力

有些能力不是普通 marketplace 插件。比如 Computer Use 在不少 Codex 桌面端环境里是随桌面运行时一起提供的能力，不一定能通过：

```bash
codex plugin add computer-use@openai-bundled
```

安装成功。

Windows 可以检查配置：

```powershell
Select-String -LiteralPath "$env:USERPROFILE\.codex\config.toml" `
  -Pattern 'computer-use@openai-bundled' -Context 1,1
```

如果看到：

```toml
[plugins."computer-use@openai-bundled"]
enabled = true
```

说明配置里已经启用。

再检查本地运行时：

```powershell
Get-ChildItem -LiteralPath "$env:LOCALAPPDATA\OpenAI\Codex\runtimes" `
  -Recurse -Filter "codex-computer-use.exe" -ErrorAction SilentlyContinue |
  Select-Object -First 5 FullName,Length,LastWriteTime
```

Mac 可以先查配置：

```bash
grep -n 'computer-use@openai-bundled' "$HOME/.codex/config.toml"
```

如果没有配置块，但你确认 Codex App 已支持 Computer Use，可以谨慎追加：

```toml
[plugins."computer-use@openai-bundled"]
enabled = true
```

不要覆盖整个 `config.toml`。如果运行时文件不存在，优先更新或重装 Codex App，而不是反复执行 `codex plugin add computer-use@openai-bundled`。

## 8. 更新本地 marketplace

如果你用的是 GitHub 方式添加的 marketplace，网络恢复后可以更新：

```bash
codex plugin marketplace upgrade
```

Windows：

```powershell
codex.cmd plugin marketplace upgrade
```

如果你用的是 zip 本地方案，更新方式是重新下载 zip、解压并覆盖旧的本地目录，然后重新运行：

```bash
codex plugin marketplace add 本地目录路径
codex plugin marketplace list
```

Windows 同理：

```powershell
codex.cmd plugin marketplace add 本地目录路径
codex.cmd plugin marketplace list
```

如果 `marketplace add` 提示已经存在，通常可以先用 `marketplace list` 看名字，再根据需要删除旧项或直接安装新版目录里的插件。普通用户最稳的办法是保留同一个本地目录路径，只替换里面的文件。

## 9. 常见错误

### `plugin was not found in marketplace`

通常是三种原因：

- marketplace 还没有添加成功。
- `插件名@marketplace名` 写错了。
- 这个插件并不在当前 marketplace 里。

先执行：

```bash
codex plugin marketplace list
codex plugin list
```

Windows：

```powershell
codex.cmd plugin marketplace list
codex.cmd plugin list
```

确认 marketplace 名和插件 manifest 名。

### `failed to run git clone ... program not found`

电脑没有安装 Git，或者 Codex 找不到 Git。弱网用户不用先折腾 Git，直接使用 zip 本地方案。

### `codex.ps1 cannot be loaded`

PowerShell 执行策略拦截了 npm 的 ps1 脚本。把命令里的 `codex` 改成 `codex.cmd`。

### 安装成功但新线程里看不到 skill

先重启 Codex App 或重新打开 CLI。再检查：

- 插件是否是 `installed, enabled`。
- skill 文件夹里是否直接包含 `SKILL.md`。
- `SKILL.md` 顶部是否有 `name` 和 `description`。
- 是否装到了 `~/.agents/skills` 或 `C:\Users\你的用户名\.agents\skills`。

### App 连接类插件仍然不可用

插件安装只代表 Codex 获得了这组工作流。涉及 Gmail、Google Drive、Slack、Notion 等外部 App 时，还需要在 ChatGPT 或 Codex 的连接流程里完成授权。弱网环境下，外部 App 授权失败不能靠重新安装插件解决。

## 10. 推荐给新手的最短路径

如果对方网络能访问 GitHub：

```bash
codex plugin marketplace add openai/role-specific-plugins --ref main
codex plugin add product-design@role-specific-plugins
```

如果对方网络不稳定：

1. 用能下载的设备打开 `https://codeload.github.com/openai/role-specific-plugins/zip/refs/heads/main`。
2. 把 zip 拷贝到目标电脑。
3. 解压到 `~/.codex/.tmp/role-specific-plugins` 或 `C:\Users\你的用户名\.codex\.tmp\role-specific-plugins`。
4. 执行 `codex plugin marketplace add 本地目录路径`。
5. 执行 `codex plugin add product-design@role-specific-plugins`。
6. 重启 Codex，开新线程测试。

这样安装路径清楚、可复制，也最适合没有 VPN 的 Mac 和 Windows 用户。
