# dsh-wsl-clipboard

DeepSeek Harness tool: **`wsl_clipboard`** — read or write the **Windows** clipboard from an agent in WSL.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 ↓](#中文)

---

## English

### Why

Copying a Linux path, command, or snippet into Notepad / ChatGPT / Explorer is awkward when the agent only lives in WSL. This tool bridges the Windows clipboard via PowerShell.

### Tool

| Arg | Required | Meaning |
|-----|----------|---------|
| `action` | yes | `get` or `set` |
| `text` | for `set` | UTF-8 text to place on the clipboard |

Long text is truncated by `maxChars` (default 100000). Do **not** put secrets on the clipboard unless the user asks.

### Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-clipboard
```

Restart `dsh web`. New session → Tools should list `wsl_clipboard`.

### Config

```yaml
- id: dsh-wsl-clipboard
  name: dsh-wsl-clipboard
  config:
    timeoutMs: 15000
    maxChars: 100000
```

### Test

```sh
npm test
```

### License

MIT

---

## 中文

### 为什么需要

Agent 在 WSL，剪贴板在 Windows。本工具用 PowerShell 读写 Windows 剪贴板，方便复制路径、命令、片段。

### 工具参数

- `action`: `get` / `set`
- `text`: `set` 时必填

勿在未经用户同意时把密钥放进剪贴板。

### 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-clipboard
```

### 许可

MIT
