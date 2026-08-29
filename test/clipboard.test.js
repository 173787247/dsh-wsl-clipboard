import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clampText,
  encodeForPowerShell,
  formatClipboardResult,
  setClipboardScriptFromBase64,
} from "../lib/clipboard.js";

describe("clipboard helpers", () => {
  it("clamps long text", () => {
    const r = clampText("a".repeat(10), 4);
    assert.equal(r.text, "aaaa");
    assert.equal(r.truncated, true);
  });

  it("round-trips utf8 via base64 for PowerShell", () => {
    const src = "路径 /home/a\nline2";
    const b64 = encodeForPowerShell(src);
    assert.equal(Buffer.from(b64, "base64").toString("utf8"), src);
    assert.match(setClipboardScriptFromBase64(b64), /FromBase64String/);
  });

  it("formats get/set reports", () => {
    assert.match(formatClipboardResult("get", { ok: true, text: "hi", chars: 2 }), /chars: 2/);
    assert.match(formatClipboardResult("set", { ok: true, chars: 3 }), /status: set/);
  });
});
