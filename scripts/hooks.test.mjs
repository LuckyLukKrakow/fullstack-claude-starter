import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
function hook(name, payload) {
  return spawnSync(process.execPath, [path.join(root, ".claude/hooks", name)], {
    input: JSON.stringify(payload), encoding: "utf8",
    env: { ...process.env, CLAUDE_PROJECT_DIR: root },
  });
}
test("protects secrets, Git internals and paths outside the repository", () => {
  for (const target of [".env", "backend/.env.production", ".git/config", "cert.key", "../escape.ts"]) {
    assert.equal(hook("protect-files.mjs", { tool_input: { file_path: target } }).status, 2, target);
  }
});
test("allows application edits and environment examples", () => {
  for (const target of ["frontend/src/App.tsx", "backend/new.java", ".env.example"]) {
    assert.equal(hook("protect-files.mjs", { tool_input: { file_path: target } }).status, 0, target);
  }
});
test("fails closed for missing target", () => {
  assert.equal(hook("protect-files.mjs", {}).status, 2);
});
test("session hook returns additional context in the Claude schema", () => {
  const result = hook("session-context.mjs", {});
  assert.equal(result.status, 0);
  const output = JSON.parse(result.stdout).hookSpecificOutput;
  assert.equal(output.hookEventName, "SessionStart");
  assert.match(output.additionalContext, /React\/TypeScript/);
});
test("formatter ignores backend files", () => {
  assert.equal(hook("format-frontend.mjs", { tool_input: { file_path: "backend/pom.xml" } }).status, 0);
});
