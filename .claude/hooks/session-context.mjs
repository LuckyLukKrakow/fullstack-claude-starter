import { spawnSync } from "node:child_process";
import { root } from "./shared.mjs";

const result = spawnSync("git", ["status", "--short", "--branch"], {
  cwd: root, encoding: "utf8", timeout: 5000,
});
const status = result.status === 0 ? result.stdout.trim() : "Git status unavailable (repository may not be initialized).";
console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: `Task app: React/TypeScript + Java 21. Git state:\n${status}\nRead docs/api.md for the contract and CLAUDE.md for GitHub workflow.`,
  },
}));
