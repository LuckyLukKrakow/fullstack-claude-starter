# Task application — main agent / coordinator

React + strict TypeScript in `frontend/`; Java 21 + Spring Boot in `backend/`.
Read `docs/api.md` before changing the HTTP contract. Local development uses H2 in memory.

## Commands (repository root)
- Install: `npm --prefix frontend ci` (lockfile is committed).
- Frontend: `npm run dev:frontend`; backend: `npm run dev:backend`.
- Checks: `npm run check:frontend`, `npm run build:frontend`, `npm run test:backend`.
- Hook tests: `npm run test:hooks`.

## Coordination
The main conversation is the coordinator. Use `frontend-engineer` for React changes,
`backend-engineer` for Java changes and `code-reviewer` for an independent review.
Subagents are peers delegated by the main agent; do not ask a subagent to spawn another.
Give each a concrete goal, owned files and acceptance criteria. Delegate in parallel only
when files do not overlap. The coordinator resolves API changes and verifies integration.
Skills: `/implement-feature`, `/check-project`, `/review-changes`, `/prepare-pr`.

## GitHub workflow
Read `git status` before changes and preserve existing work. Start from an issue or user
request. Use a descriptive `feature/…` or `fix/…` branch; never implement directly on main.
Do not infer permission to publish, push, merge or deploy from a request to implement.
When publishing a PR is requested, use a draft PR, the repository PR template, explicit
test results and the issue reference. Never invent passed checks or resolved issues.
Do not force-push, bypass checks or merge automatically. Use `gh` only when installed
and authenticated. GitHub Actions is the shared verification gate.

## Implementation constraints
Keep controllers thin; transactions and business rules belong in services. Return DTOs,
not JPA entities. Validate inputs on the backend. Frontend network code lives in `api.ts`;
cover loading, empty and failure states. Keep API documentation and both sides consistent.
For behavior changes add focused tests, run relevant checks and report missing tools.
The demo has no authentication; don't present it as production-ready.

Hooks assist the workflow; CI verifies it independently. Never treat hook regexes,
prompt instructions or agent tool lists as an operating-system security boundary.
