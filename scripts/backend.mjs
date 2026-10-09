import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const goal = process.argv[2];
if (!["test", "verify", "spring-boot:run"].includes(goal)) {
  console.error("Allowed goals: test, verify, spring-boot:run");
  process.exit(1);
}
// The shell only receives fixed, allowlisted arguments; never a prompt or file path.
const result = spawnSync(process.platform === "win32" ? "mvn.cmd" : "mvn", ["-B", goal], {
  cwd: fileURLToPath(new URL("../backend/", import.meta.url)),
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (result.error) console.error("Install JDK 21 and Maven 3.9+, and add them to PATH.", result.error.message);
process.exit(result.status ?? 1);
