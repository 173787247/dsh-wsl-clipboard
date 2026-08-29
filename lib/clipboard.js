const MAX_CHARS = 100_000;

export function clampText(text, max = MAX_CHARS) {
  const s = String(text ?? "");
  if (s.length <= max) return { text: s, truncated: false };
  return { text: s.slice(0, max), truncated: true };
}

export function encodeForPowerShell(text) {
  return Buffer.from(String(text ?? ""), "utf8").toString("base64");
}

export function getClipboardScript() {
  return [
    "$OutputEncoding = [Console]::OutputEncoding = [Text.UTF8Encoding]::UTF8",
    "[Console]::Out.Write([System.Windows.Forms.Clipboard]::GetText())",
  ].join("; ");
}

/** Prefer Add-Type System.Windows.Forms; fall back to Get-Clipboard. */
export function getClipboardScriptSafe() {
  return [
    "Add-Type -AssemblyName System.Windows.Forms",
    "$t = [System.Windows.Forms.Clipboard]::GetText()",
    "if ($null -eq $t) { $t = '' }",
    "[Console]::Out.Write($t)",
  ].join("; ");
}

export function setClipboardScriptFromBase64(b64) {
  const safe = String(b64).replace(/'/g, "''");
  return [
    "Add-Type -AssemblyName System.Windows.Forms",
    `$bytes = [Convert]::FromBase64String('${safe}')`,
    "$text = [Text.Encoding]::UTF8.GetString($bytes)",
    "[System.Windows.Forms.Clipboard]::SetText($text)",
    "'ok'",
  ].join("; ");
}

export function formatClipboardResult(action, payload) {
  const lines = [`clipboard ${action}`];
  if (payload.ok === false) {
    lines.push(`error: ${payload.error || "failed"}`);
    return lines.join("\n");
  }
  if (action === "get") {
    lines.push(`chars: ${payload.chars ?? 0}${payload.truncated ? " (truncated)" : ""}`);
    lines.push("---");
    lines.push(payload.text ?? "");
  } else {
    lines.push(`chars: ${payload.chars ?? 0}`);
    lines.push("status: set");
  }
  return lines.join("\n");
}
