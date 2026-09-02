# dsh-wsl-clipboard
> **套件安装：** 见 [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)。推荐 `KIT_SET=daily` | `llm` | `github` | `full`。故障树：[TROUBLESHOOTING.zh.md](https://github.com/173787247/dsh-wsl-kit/blob/master/docs/TROUBLESHOOTING.zh.md)。


DeepSeek Harness 工具：**`wsl_clipboard`** — 在 WSL 里的 Agent 读写 **Windows** 剪贴板。

属于 **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**。

[English → README.md](./README.md)

---

## 为什么需要

Agent 只在 WSL 里时，要把 Linux 路径、命令或片段复制到记事本 / ChatGPT / 资源管理器很别扭。本工具通过 PowerShell 对接 Windows 剪贴板。

## 工具

| 参数 | 是否必填 | 含义 |
|------|----------|------|
| `action` | 是 | `get` 或 `set` |
| `text` | `set` 时必填 | 写入剪贴板的 UTF-8 文本 |

过长文本按 `maxChars` 截断（默认 100000）。**未经用户要求，不要把密钥放进剪贴板。**

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-clipboard
```

重启 `dsh web`。新会话 → Tools 应列出 `wsl_clipboard`。

## 配置

```yaml
- id: dsh-wsl-clipboard
  name: dsh-wsl-clipboard
  config:
    timeoutMs: 15000
    maxChars: 100000
```

| 键 | 默认 | 含义 |
|----|------|------|
| `timeoutMs` | `15000` | 工具超时 |
| `maxChars` | `100000` | 剪贴板文本最大长度 |

## 测试

```sh
npm test
```

## 许可

MIT
