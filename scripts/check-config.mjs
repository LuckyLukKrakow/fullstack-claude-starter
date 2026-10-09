import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { __debug } from "../frontend/node_modules/prettier/index.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const settings = JSON.parse(fs.readFileSync(path.join(root, ".claude/settings.json"), "utf8"));
for (const [event, groups] of Object.entries(settings.hooks)) {
  assert.ok(["SessionStart", "PreToolUse", "PostToolUse"].includes(event));
  for (const group of groups) {
    for (const handler of group.hooks) {
      const match = handler.command.match(/\/\.claude\/hooks\/([^"\s]+)/);
      assert.ok(match, handler.command);
      assert.ok(fs.existsSync(path.join(root, ".claude/hooks", match[1])));
    }
  }
}
const skillFields = new Set(["name", "description", "context", "agent", "allowed-tools", "disable-model-invocation", "user-invocable", "argument-hint"]);
const agentFields = new Set(["name", "description", "tools", "model", "permissionMode", "skills"]);
for (const kind of ["skills", "agents"]) {
  const base = path.join(root, ".claude", kind);
  for (const name of fs.readdirSync(base)) {
    const file = kind === "skills" ? path.join(base, name, "SKILL.md") : path.join(base, name);
    const text = fs.readFileSync(file, "utf8").replaceAll("\r\n", "\n");
    const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/);
    assert.ok(frontmatter, file);
    await __debug.parse(frontmatter[1], { parser: "yaml" });
    const fields = Object.fromEntries(frontmatter[1].split("\n").map((line) => {
      const index = line.indexOf(":");
      assert.ok(index > 0, file);
      return [line.slice(0, index), line.slice(index + 1).trim()];
    }));
    assert.match(fields.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(fields.name.length <= 64);
    assert.ok(fields.description && fields.description.length <= 1024);
    assert.ok(!text.includes("[TODO:"));
    for (const field of Object.keys(fields)) assert.ok((kind === "skills" ? skillFields : agentFields).has(field), field);
    if (fields.agent) assert.ok(fs.existsSync(path.join(root, ".claude/agents", `${fields.agent}.md`)));
    assert.equal(fields.name, kind === "skills" ? name : name.replace(/\.md$/, ""));
  }
}
for (const file of [".github/workflows/ci.yml", ".github/ISSUE_TEMPLATE/feature.yml"]) {
  await __debug.parse(fs.readFileSync(path.join(root, file), "utf8"), { parser: "yaml" });
}
console.log("JSON, YAML, skill/agent frontmatter and hook references: valid.");
