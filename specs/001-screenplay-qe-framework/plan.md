# Implementation Plan: Screenplay-Based Quality Engineering Framework

**Branch**: `001-screenplay-qe-framework` | **Date**: 2026-08-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-screenplay-qe-framework/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Build StageCraft: a small, executable Screenplay Pattern reference implementation on top of
**Serenity/JS** (not a custom Screenplay engine), demonstrating the full flow of Actor → Ability
→ Task → Interaction → System Under Test → Question → Assertion → Serenity Report across two
UI scenarios (via Playwright) and two API scenarios (via a public REST demo API), with strict
TypeScript, npm-scripted execution, and a self-contained Serenity/JS HTML report.

## Technical Context

**Language/Version**: TypeScript 5.9.3 (strict mode) on Node.js ^22.22.2 (LTS) — required by
`@serenity-js/html-reporter@3.45.x`'s `engines` constraint (`^22.22.2 || ^24.15.0`); Node 24.15+
is an acceptable alternative.

**Primary Dependencies** (mutually compatible, current stable, lockstep Serenity/JS 3.45.x line):
- `@serenity-js/core` `^3.45.9` — Screenplay Pattern core: `Actor`, `Ability`, `Task`,
  `Interaction`, `Question`, actor lifecycle.
- `@serenity-js/web` `^3.45.9` — technology-agnostic Screenplay Web API (`Navigate`, `Page`,
  `Click`, `Enter`, locators) shared across web automation engines.
- `@serenity-js/playwright` `^3.45.9` — binds `@serenity-js/web` to Playwright
  (`BrowseTheWebWithPlaywright` ability).
- `@serenity-js/playwright-test` `^3.45.9` — Playwright Test runner integration (actor fixture,
  Serenity reporter hook for `playwright.config.ts`).
- `@serenity-js/rest` `^3.45.9` — Screenplay REST/HTTP API (`CallAnApi` ability, `Send`
  interaction, response `Question`s), built on Axios.
- `@serenity-js/assertions` `^3.45.9` — `Ensure`, and expectation matchers (`equals`,
  `includes`, `startsWith`, etc.) used by Assertions.
- `@serenity-js/console-reporter` `^3.45.9` — human-readable console output during test runs.
- `@serenity-js/html-reporter` `^3.45.9` — self-contained static HTML report (screenshots,
  activity trees, execution history); drives the `engines` constraint above.
- `@playwright/test` `^1.62.1` — test runner and browser automation engine (paired with the
  `@serenity-js/playwright-test` version above per its tested peer range).
- `typescript` `^5.9.3` — strict compiler.
- `ts-node` (dev-only, if needed for scripts) — not required for the Playwright Test runner
  itself, which compiles via `@playwright/test`'s own TS support; omitted unless a build step
  needs it.

No additional libraries are introduced beyond this set; all Screenplay concepts are implemented
using Serenity/JS primitives (no custom Screenplay engine, per Constitution Principle I and the
Architectural Constraints in the plan input).

**Storage**: N/A — no persistence layer; the API demo scenarios talk to an external public REST
API (JSONPlaceholder), and the UI demo scenarios talk to a public static demo web app (TodoMVC).

**Testing**: `@playwright/test` as the test runner (via `@serenity-js/playwright-test`), used for
both UI and API scenarios so both channels share one runner, one config, and one report.

**Target Platform**: Cross-platform Node.js CLI execution (Windows/macOS/Linux), headless or
headed Chromium via Playwright; no server component.

**Project Type**: Single project — a test automation framework/reference implementation (not a
web/mobile app), per Project Structure Option 1 (single project), adapted to Screenplay-specific
folders instead of generic `models/services/cli/lib`.

**Performance Goals**: N/A — this is a demonstration framework, not a production system;
NFR-004 (determinism/repeatability) matters more than throughput. Informal target: full
demonstration suite (4 scenarios) completes in under 2 minutes on a typical developer machine.

**Constraints**: No secrets/credentials committed (per plan input and constitution); demo
targets must not require authentication; scenarios must be deterministic and independently
re-runnable.

**Scale/Scope**: 4 demonstration scenarios (2 UI + 2 API) across ~6 Screenplay component
categories (actors, abilities, tasks, interactions, questions, config) — intentionally small
per Constitution Principle X (Simplicity Before Abstraction).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance approach |
|---|---|
| I. Screenplay Pattern First | Implemented via Serenity/JS (`@serenity-js/core`/`web`/`rest`), not a custom engine. Actor/Ability/Task/Interaction/Question/Assertion each map to a distinct folder (`src/actors`, `src/abilities`, `src/tasks`, `src/interactions`, `src/questions`) and Serenity/JS type. |
| II. Intent Over Implementation | Tasks are named for business intent (`OpenApplication`, `AddItemToList`, `GetPost`, `CreatePost`), not mechanics. Low-level ops live in Interactions/Serenity/JS primitives only. |
| III. Technology-Agnostic Screenplay Architecture | UI and API scenarios both use `actorCalled(...).attemptsTo(...)`; only the `Ability` (`BrowseTheWebWithPlaywright` vs `CallAnApi`) and the underlying Interaction differ. |
| IV. Composition and Reusability | At least one Question (e.g., a REST response Question) and one Task pattern reused across both scenarios in a channel; demonstrated explicitly in `quickstart.md` validation steps. |
| V. Separation of Concerns | Enforced by folder structure + Serenity/JS types (`Task`, `Interaction`, `Question`, `Ability`); no cross-cutting "helper" module. |
| VI. Readability | Business-oriented naming reviewed as part of Phase 1 data model; test scenario files read as plain-language Actor/Task sequences. |
| VII. Type Safety | `tsconfig.json` with `"strict": true`; no `any` in framework code (contracts documented in `data-model.md`). |
| VIII. Testability | 2 UI + 2 API scenarios, deterministic public demo targets (TodoMVC, JSONPlaceholder), no flaky auth/state dependencies. |
| IX. Observable Execution | `@serenity-js/console-reporter` (console) + `@serenity-js/html-reporter` (HTML, screenshots-on-failure via Photographer) wired into `playwright.config.ts`. |
| X. Simplicity Before Abstraction | No custom base classes/factories/DI; Serenity/JS primitives used directly; folder structure kept flat and small (see Architectural Constraints below). |
| XI. Scalable Architecture | New channels (DB, messaging) would add a new `Ability` + `Interaction` set without changing `Actor`/`Task`/`Question` shape — documented in `quickstart.md`/README scalability section. |
| XII. Specification and Implementation Alignment | This plan derives directly from `spec.md`'s FR-001..FR-015/NFR-001..NFR-006; no functionality added beyond it. |
| XIII. Verification Before Completion | Validation Strategy section (below) requires install → compile → run UI → run API → generate report → verify report/diagnostics/README before the feature is considered done. |
| XIV. Documentation as a First-Class Artifact | README structure specified in Phase 1 (`quickstart.md` references it); explains architecture rationale, not just file listing. |

**Result**: PASS — no violations requiring justification. Complexity Tracking table below is empty.

**Post-Design Re-check** (after Phase 1 `data-model.md`/`quickstart.md`): PASS, unchanged. The
data model introduced no new components, base classes, or abstractions beyond the six
Screenplay concepts already covered above; no `contracts/` artifacts were needed since
StageCraft exposes no external API/library surface (see Project Structure note below).

## Project Structure

### Documentation (this feature)

```text
specs/001-screenplay-qe-framework/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md         # Phase 1 output (/speckit-plan command)
└── tasks.md              # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

No `contracts/` directory is generated: StageCraft is a self-contained test automation
framework/reference implementation, not a library or service exposing an external interface to
other systems or consumers. The only "interfaces" are the Screenplay component contracts
(Task/Interaction/Question/Ability shapes), which are captured in `data-model.md` instead.

### Source Code (repository root)

```text
# Option 1: Single project — Screenplay reference implementation (chosen)
src/
├── actors/            # Actor factory/cast (e.g., QA User) and Actor-related config
├── abilities/          # Thin wrappers/re-exports around Serenity/JS Abilities
│   │                    # (BrowseTheWebWithPlaywright, CallAnApi) plus any StageCraft-specific
│   │                    # ability configuration (base URLs, timeouts)
├── tasks/              # Business-oriented Tasks (OpenApplication, AddItemToList,
│   │                    # GetPost, CreatePost)
├── interactions/        # Small reusable low-level Interactions not already provided by
│   │                    # @serenity-js/web or @serenity-js/rest
├── questions/           # Questions over UI state (via @serenity-js/web) and API responses
│   │                    # (via @serenity-js/rest), e.g., ListItemNames, ResponseStatusCode
└── config/              # Environment-driven configuration (BASE_URL, API_BASE_URL, HEADLESS)

tests/
├── ui/                  # UI demonstration scenarios (Playwright Test + Serenity/JS)
└── api/                 # API demonstration scenarios (Playwright Test + Serenity/JS)

reports/
└── serenity-js/         # @serenity-js/html-reporter output (generated, not committed)

test-results/            # Playwright Test's own run artifacts (generated, not committed)

playwright.config.ts      # Serenity/JS + Playwright Test runner & reporter configuration
tsconfig.json             # Strict TypeScript configuration
package.json               # npm scripts: install, test:ui, test:api, test, report
.env.example                # Documented configurable values, no real secrets
README.md                  # Architecture, Screenplay Pattern, execution instructions
```

**Structure Decision**: Single project (Option 1), adapted to Screenplay-specific folders
(`actors/abilities/tasks/interactions/questions/config`) instead of the generic
`models/services/cli/lib` layout, exactly as specified in the plan input's Project Structure
section. `tests/ui` and `tests/api` keep the two interaction channels clearly separated while
sharing the same `src/` Screenplay components, directly demonstrating Constitution Principle
III (Technology-Agnostic Screenplay Architecture). No `backend/`/`frontend`/mobile split
applies — this is a test framework, not an application under test.

## Complexity Tracking

*No entries — the Constitution Check above reported no violations.*
