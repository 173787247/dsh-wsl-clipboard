import { detectWsl, runPowerShell } from "./lib/wsl-host.js";
import {
  clampText,
  encodeForPowerShell,
  formatClipboardResult,
  getClipboardScriptSafe,
  setClipboardScriptFromBase64,
} from "./lib/clipboard.js";

export const name = "dsh-wsl-clipboard";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const timeoutMs = positive(config.timeoutMs, 15_000);
  const maxChars = positive(config.maxChars, 100_000);
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:wsl_clipboard",
    order: 117,
    text: [
      "Use wsl_clipboard to read or write the Windows clipboard from WSL.",
      "Prefer it when the user asks to copy a path, command, or snippet between Linux and Windows apps.",
      "Do not put secrets into the clipboard unless the user explicitly asks.",
    ].join(" "),
  });

  ctx.tools.register({
    name: "wsl_clipboard",
    description: "Read or write the Windows clipboard from WSL (UTF-8 text).",
    parameters: {
      type: "object",
      additionalProperties: false,
      required: ["action"],
      properties: {
        action: {
          type: "string",
          enum: ["get", "set"],
          description: "get = read Windows clipboard; set = write text to it.",
        },
        text: {
          type: "string",
          description: "Required when action=set. Plain text to place on the clipboard.",
        },
      },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ok: { type: "boolean" },
          action: { type: "string" },
          text: { type: "string" },
          chars: { type: "integer" },
          truncated: { type: "boolean" },
          error: { type: "string" },
        },
      },
      render: (_args, value) => [{ type: "text", text: formatClipboardResult(value.action || "get", value) }],
    },
    timeoutMs,
    isConcurrencySafe: () => false,
    async execute(args) {
      if (!wsl) {
        return { ok: false, action: args?.action || "get", error: "not running in WSL" };
      }
      const action = args?.action === "set" ? "set" : "get";
      try {
        if (action === "get") {
          const { stdout } = await runPowerShell(getClipboardScriptSafe(), { timeoutMs });
          const clamped = clampText(stdout, maxChars);
          return {
            ok: true,
            action: "get",
            text: clamped.text,
            chars: clamped.text.length,
            truncated: clamped.truncated,
          };
        }
        if (typeof args?.text !== "string") {
          return { ok: false, action: "set", error: "missing text" };
        }
        const clamped = clampText(args.text, maxChars);
        const b64 = encodeForPowerShell(clamped.text);
        await runPowerShell(setClipboardScriptFromBase64(b64), { timeoutMs });
        return {
          ok: true,
          action: "set",
          chars: clamped.text.length,
          truncated: clamped.truncated,
        };
      } catch (err) {
        return {
          ok: false,
          action,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    },
    presentCall: () => ({ card: "generic", title: "WSL clipboard" }),
    presentResult: (_args, result) => (
      result.isError
        ? { card: "generic", title: "WSL clipboard failed", content: result.content }
        : { card: "generic", title: "WSL clipboard", content: result.content }
    ),
  });
}

function positive(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
