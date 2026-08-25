# Phase 0 Research: Screenplay-Based Quality Engineering Framework

All Technical Context items were resolvable from the plan input and current package registry
data — no `NEEDS CLARIFICATION` markers remain. This document records the decisions and the
alternatives considered.

## 1. Screenplay Pattern implementation

**Decision**: Use `@serenity-js/core`, `@serenity-js/web`, `@serenity-js/rest`, and
`@serenity-js/playwright` rather than writing a custom Screenplay engine.

**Rationale**: The plan input and Constitution Principle I explicitly require using Serenity/JS
rather than a custom implementation. Serenity/JS already provides typed `Actor`, `Ability`,
`Task`, `Interaction`, `Question`, and `Ensure`/Assertion primitives, is actively maintained
(latest release 4 days old at time of research), and provides first-class Playwright and
reporting integration — directly satisfying FR-001–FR-007 and Constitution Principles I, VII.

**Alternatives considered**:
- Custom Screenplay engine — rejected: violates Constitution Principle I (Screenplay Pattern
  First expects the pattern, not a bespoke reimplementation) and Principle X (Simplicity Before
  Abstraction — building an engine is unnecessary complexity when a mature one exists).
- `serenity-js/serenity-bdd` (Java-based Serenity BDD reporting bridge) — rejected: requires a
  JVM/Java toolchain, adding an unnecessary dependency the plan input does not call for; the
  newer `@serenity-js/html-reporter` provides equivalent reporting without Java.

## 2. Test runner

**Decision**: `@playwright/test` via `@serenity-js/playwright-test`, used for both UI and API
scenarios.

**Rationale**: `@serenity-js/playwright-test` provides an `actor` fixture and wires the
Serenity/JS stage crew (reporters) directly into `playwright.config.ts`, so one runner and one
config serve both channels — directly satisfying FR-010 (UI and API share the same conceptual
model) and Success Criterion SC-005. Using Playwright Test for API scenarios too (rather than
Mocha/Cucumber) avoids introducing a second test runner/dependency, honoring Principle X.

**Alternatives considered**:
- Mocha (`@serenity-js/core` + manual Playwright browser bootstrap, as shown in Serenity/JS's
  "Usage with Mocha" docs) — rejected: requires manually managing browser lifecycle and crew
  configuration that Playwright Test + `@serenity-js/playwright-test` provide out of the box;
  adds complexity without benefit for this small reference implementation.
- Cucumber — rejected: Gherkin/BDD layer is not requested by the spec or plan input and would
  add an unnecessary abstraction layer (Principle X).

## 3. Package versions

**Decision**: Pin the entire `@serenity-js/*` set to `^3.45.9` (the current lockstep-published
version across `core`, `web`, `playwright`, `playwright-test`, `rest`, `assertions`,
`console-reporter`, and `html-reporter` as of 2026-08-25), `@playwright/test` to `^1.62.1`
(the version `@serenity-js/html-reporter@3.45.9`'s own devDependencies test against), and
`typescript` to `^5.9.3`.

**Rationale**: Serenity/JS publishes its packages as a monorepo with synchronized version
numbers; using a single version across all `@serenity-js/*` packages avoids peer-dependency
mismatches (each package's `peerDependencies`/`devDependencies` reference sibling packages at
the same version). `@playwright/test` `^1.62.1` is confirmed via the `html-reporter` package's
own `devDependencies` as the version it is built/tested against. TypeScript `5.9.3` is the
version Serenity/JS itself develops against and is current stable.

**Alternatives considered**:
- Pinning older Serenity/JS 3.x releases (e.g., 3.2x–3.3x) — rejected: plan input requires
  "prefer current stable versions" and "avoid deprecated APIs"; no technical constraint favors
  an older line.
- Serenity/JS 2.x — rejected: shown as `"deprecated": "Please use the latest stable 2.x"` in
  historical registry data and long superseded by the 3.x Screenplay-first architecture that
  this project depends on.

## 4. Node.js version

**Decision**: Target Node.js `^22.22.2` (LTS) as the primary supported runtime, with
`^24.15.0` documented as an acceptable alternative.

**Rationale**: `@serenity-js/html-reporter@3.45.x` declares `"engines": { "node": "^22.22.2 ||
^24.15.0" }` — the newest and narrowest constraint among the selected dependencies, so it
determines the effective minimum. All other selected `@serenity-js/*` 3.45.x packages and
`@playwright/test@1.62.1` are compatible with this range. Node 22 is the active LTS release
line as of the research date, satisfying "prefer current stable versions."

**Alternatives considered**:
- Node.js 18 (previous LTS) — rejected: incompatible with `@serenity-js/html-reporter@3.45.x`'s
  `engines` field; would force pinning an older, unsupported html-reporter version.

## 5. UI demonstration target

**Decision**: Use the publicly hosted TodoMVC reference app
(`https://todomvc.com/examples/react/dist/`) as the UI system under test.

**Rationale**: TodoMVC is a stable, purpose-built demo application with no authentication, no
server-side state shared between runs (state is client-side/local), and simple, well-known DOM
structure — ideal for deterministic, repeatable Screenplay UI scenarios (FR-008, NFR-004). It is
also the application used in Serenity/JS's own official web-testing examples, so its DOM
conventions are well documented for a Screenplay-based approach.

**Alternatives considered**:
- `https://serenity-js.org` (used in Serenity/JS's own "Quick Start" snippets) — viable but only
  supports a trivial "page has a title" scenario; would not demonstrate a second, distinct UI
  interaction (e.g., data entry) needed for two independent UI scenarios.
- A custom local static HTML fixture — rejected: adds a hosting/serving concern (a local web
  server) that is unnecessary complexity for this reference implementation (Principle X); a
  public, stable demo app avoids that entirely.

## 6. API demonstration target

**Decision**: Use JSONPlaceholder (`https://jsonplaceholder.typicode.com`) as the API system
under test, matching the plan input's explicit preference.

**Rationale**: JSONPlaceholder is a free, stable, public fake REST API requiring no
authentication or API keys, with deterministic canned responses for `GET /posts/:id` and a
deterministic echo-style response for `POST /posts` — directly supporting FR-009, NFR-004, and
the plan input's `GetPost`/`CreatePost` Task examples, with no secrets to manage (Out of Scope:
enterprise authentication infrastructure).

**Alternatives considered**:
- `reqres.in` — viable alternative fake REST API; rejected only because JSONPlaceholder was
  explicitly named in the plan input ("Prefer JSONPlaceholder or an equivalent deterministic
  API").

## 7. Reporting strategy

**Decision**: Configure both `@serenity-js/console-reporter` (immediate console feedback) and
`@serenity-js/html-reporter` (self-contained static HTML report with activity trees and
screenshots-on-failure) as the Serenity/JS "stage crew" in `playwright.config.ts`.

**Rationale**: Directly satisfies FR-011, NFR-005, and Constitution Principle IX (Observable
Execution) — the HTML report shows Actor, Task, Interaction, Question, and Assertion-level
detail per scenario, plus screenshots for UI failures. `@serenity-js/html-reporter` replaces the
older Java-based `@serenity-js/serenity-bdd` reporter, avoiding a JVM dependency.

**Alternatives considered**:
- `@serenity-js/serenity-bdd` (Java-based Serenity BDD report) — rejected: requires a JVM and JAR
  download step, an unnecessary dependency for this project (Principle X); `html-reporter`'s own
  documentation recommends it as the simpler successor.
- Playwright's native HTML reporter only (no Serenity/JS reporter) — rejected: would not surface
  Actor/Task/Question-level detail required by FR-011 and User Story 5; Serenity/JS reporting is
  explicitly required by the plan input.

## 8. Configuration strategy

**Decision**: Use environment variables (`BASE_URL`, `API_BASE_URL`, `HEADLESS`) read in
`src/config/`, with a committed `.env.example` documenting safe development defaults
(`BASE_URL=https://todomvc.com/examples/react/dist/`,
`API_BASE_URL=https://jsonplaceholder.typicode.com`, `HEADLESS=true`) and no `.env` file
committed.

**Rationale**: Matches the plan input's Configuration section and Constitution's "no secrets
committed" requirement; since both demo targets are public and unauthenticated, there are no
secrets to manage, only endpoint/behavior toggles.

**Alternatives considered**:
- Hardcoded URLs in Tasks — rejected: violates the plan input's explicit requirement to support
  `BASE_URL`/`API_BASE_URL`/`HEADLESS` via environment variables.
