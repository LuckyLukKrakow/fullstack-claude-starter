import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(process.env.CLAUDE_PROJECT_DIR || fileURLToPath(new URL("../../", import.meta.url)));
export function input() { return JSON.parse(fs.readFileSync(0, "utf8") || "{}"); }
export function relativeFile(file) {
  if (typeof file !== "string" || !file) throw new Error("Missing file_path");
  const absolute = path.resolve(root, file);
  // Resolve existing symlinks, including the nearest existing ancestor of new files.
  let ancestor = absolute;
  const tail = [];
  while (!fs.existsSync(ancestor)) {
    const parent = path.dirname(ancestor);
    if (parent === ancestor) break;
    tail.unshift(path.basename(ancestor));
    ancestor = parent;
  }
  const resolved = path.join(fs.realpathSync(ancestor), ...tail);
  const relative = path.relative(fs.realpathSync(root), resolved);
  if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error("Path outside repository");
  }
  return { absolute: resolved, relative: relative.split(path.sep).join("/") };
}
