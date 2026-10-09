---
name: prepare-pr
description: Prepare a GitHub pull request description, inspect local changes and publish a draft PR only when explicitly requested.
---
Prepare the PR for $ARGUMENTS. Inspect git status and diff; determine the real target branch
from repository metadata instead of inventing it. Run /check-project for code changes.
Fill .github/pull_request_template.md with the final behavior, issue link and actual results.
Write the body to .claude/local/pr-body.md, creating the directory if needed; it is ignored.
Never invent a Fixes reference. Include known limitations and checks not run.
If the user requested publishing: confirm gh auth status, commit only relevant files,
push the feature branch and run gh pr create --draft --base <actual-base> --body-file
.claude/local/pr-body.md --title <concrete-title>. Follow existing authorization; do not
ask again if publishing was already requested. Otherwise deliver the prepared body locally.
Report the resulting URL, inspect gh pr checks when available, and never merge automatically.
