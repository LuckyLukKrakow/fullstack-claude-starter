import { input, relativeFile } from "./shared.mjs";

try {
  const { relative } = relativeFile(input().tool_input?.file_path);
  const lower = relative.toLowerCase();
  const parts = lower.split("/");
  const name = parts.at(-1);
  const secret = name === ".env" || (name.startsWith(".env.") && name !== ".env.example");
  if (secret || parts.includes(".git") || /\.(pem|key|p12|pfx)$/.test(lower)) {
    console.error(`Protected file: ${relative}. Use an example file or request a deliberate manual change.`);
    process.exit(2);
  }
} catch (error) {
  console.error(`Cannot validate target: ${error.message}`);
  process.exit(2);
}
