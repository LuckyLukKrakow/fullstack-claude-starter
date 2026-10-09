---
name: review-changes
description: Review a supplied diff or source paths for defects in the task application's React and Java implementation.
context: fork
agent: code-reviewer
---
Review $ARGUMENTS. Read the supplied files or diff and docs/api.md.
Identify concrete correctness issues and regressions. Return file/line, impact and a
specific reproduction scenario. If no diff was supplied, ask the coordinator for the diff
or intended comparison; this agent has no command execution tools.
