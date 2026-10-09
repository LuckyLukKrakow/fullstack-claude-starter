import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { input, relativeFile, root } from "./shared.mjs";

try {
  const { absolute, relative } = relativeFile(input().tool_input?.file_path);
  if (!relative.startsWith("frontend/") || !/\.(tsx?|jsx?|css|json|html|md)$/.test(relative)) process.exit(0);
  const formatter = path.join(root, "frontend/node_modules/prettier/bin/prettier.cjs");
  if (!fs.existsSync(formatter)) {
    console.error("Formatter unavailable: run npm --prefix frontend ci first.");
    process.exit(1);
  }
  // No shell: paths are passed as arguments, not interpreted as commands.
  const result = spawnSync(process.execPath, [formatter, "--write", absolute], {
    cwd: path.join(root, "frontend"), encoding: "utf8", timeout: 25000,
  });
  if (result.status !== 0) {
    console.error(result.stderr || result.error?.message || "Formatting failed");
    process.exit(1);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
