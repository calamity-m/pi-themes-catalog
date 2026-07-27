import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const requiredColors = [
  "accent",
  "border",
  "borderAccent",
  "borderMuted",
  "success",
  "error",
  "warning",
  "muted",
  "dim",
  "text",
  "thinkingText",
  "selectedBg",
  "userMessageBg",
  "userMessageText",
  "customMessageBg",
  "customMessageText",
  "customMessageLabel",
  "toolPendingBg",
  "toolSuccessBg",
  "toolErrorBg",
  "toolTitle",
  "toolOutput",
  "mdHeading",
  "mdLink",
  "mdLinkUrl",
  "mdCode",
  "mdCodeBlock",
  "mdCodeBlockBorder",
  "mdQuote",
  "mdQuoteBorder",
  "mdHr",
  "mdListBullet",
  "toolDiffAdded",
  "toolDiffRemoved",
  "toolDiffContext",
  "syntaxComment",
  "syntaxKeyword",
  "syntaxFunction",
  "syntaxVariable",
  "syntaxString",
  "syntaxNumber",
  "syntaxType",
  "syntaxOperator",
  "syntaxPunctuation",
  "thinkingOff",
  "thinkingMinimal",
  "thinkingLow",
  "thinkingMedium",
  "thinkingHigh",
  "thinkingXhigh",
  "bashMode",
];

const themeDir = new URL("../themes/", import.meta.url);
const files = (await readdir(themeDir)).filter((file) => file.endsWith(".json")).sort();
assert(files.length > 0, "themes/ must contain at least one JSON theme");

const names = new Set();
for (const file of files) {
  const path = join(themeDir.pathname, file);
  const theme = JSON.parse(await readFile(path, "utf8"));

  assert.equal(typeof theme.name, "string", `${file}: name must be a string`);
  assert(theme.name.length > 0, `${file}: name must not be empty`);
  assert(!theme.name.includes("/"), `${file}: name must not contain /`);
  assert(!names.has(theme.name), `${file}: duplicate theme name ${theme.name}`);
  names.add(theme.name);

  assert(theme.colors && typeof theme.colors === "object", `${file}: colors must be an object`);
  for (const token of requiredColors) {
    assert(token in theme.colors, `${file}: missing color token ${token}`);
  }

  const vars = theme.vars ?? {};
  const resolveColor = (value, label, visited = new Set()) => {
    if (Number.isInteger(value)) {
      assert(value >= 0 && value <= 255, `${file}: ${label} must be between 0 and 255`);
      return;
    }
    assert.equal(typeof value, "string", `${file}: ${label} must be a string or integer`);
    if (value === "" || /^#[0-9a-f]{6}$/i.test(value)) return;
    assert(value in vars, `${file}: ${label} references unknown variable ${value}`);
    assert(!visited.has(value), `${file}: circular variable reference ${value}`);
    resolveColor(vars[value], `variable ${value}`, new Set([...visited, value]));
  };

  for (const [token, value] of Object.entries(theme.colors)) {
    resolveColor(value, `color ${token}`);
  }
  for (const [token, value] of Object.entries(theme.export ?? {})) {
    resolveColor(value, `export color ${token}`);
  }
}

console.log(`Validated ${files.length} themes: ${[...names].join(", ")}`);
