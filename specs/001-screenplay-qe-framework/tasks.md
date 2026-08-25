---

description: "Task list for StageCraft: Screenplay-Based Quality Engineering Framework"
---

# Tasks: Screenplay-Based Quality Engineering Framework

**Input**: Design documents from `specs/001-screenplay-qe-framework/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: Not requested as a separate TDD layer — the demonstration scenarios in `tests/ui/`
and `tests/api/` created below **are** the framework's tests (there is no separate application
under test to unit-test; StageCraft's own "tests" are its product).

**Organization**: Phases follow the user's requested implementation order (vertical-slice
first). Where a phase's work corresponds to a spec.md user story, tasks are labeled `[US1]`–
`[US6]` for traceability. Setup/Foundational/Polish phases carry no story label, per convention.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no unresolved dependency on an incomplete task)
- **[Story]**: Maps to spec.md user stories (US1=P1 Understand, US2=P2 UI, US3=P3 API,
  US4=P4 Reuse, US5=P5 Reporting, US6=P6 Full demonstration)
- Every task names its exact file(s)

## Path Conventions

Single project, per plan.md Project Structure:
`src/{actors,abilities,tasks,interactions,questions,config}/`, `tests/{ui,api}/`,
`reports/serenity-js/` (generated), `playwright.config.ts`, `tsconfig.json`, `package.json`,
`.env.example` at repository root.

---

## Phase 1: Project Foundation (Setup)

**Purpose**: A compilable, dependency-installed, environment-aware project skeleton. Nothing
here is Screenplay-specific yet.

- [X] T001 Create the directory skeleton per plan.md Project Structure:
  `src/actors/`, `src/abilities/`, `src/tasks/`, `src/interactions/`, `src/questions/`,
  `src/config/`, `tests/ui/`, `tests/api/` (each with a `.gitkeep` if empty)
- [X] T002 Initialize `package.json` (`npm init -y`, then set `name: "stagecraft"`,
  `private: true`, `description`, `license`) in `package.json`
- [X] T003 Install pinned dependencies in `package.json` / `package-lock.json`:
  production/runtime — `@serenity-js/core@^3.45.9`, `@serenity-js/web@^3.45.9`,
  `@serenity-js/playwright@^3.45.9`, `@serenity-js/playwright-test@^3.45.9`,
  `@serenity-js/rest@^3.45.9`, `@serenity-js/assertions@^3.45.9`,
  `@serenity-js/console-reporter@^3.45.9`, `@serenity-js/html-reporter@^3.45.9`,
  `@playwright/test@^1.62.1`; dev — `typescript@^5.9.3`, `@types/node` (matching Node
  `^22.22.2`)
- [X] T004 [P] Configure strict TypeScript in `tsconfig.json`: `"strict": true`,
  `"module": "commonjs"`, `"moduleResolution": "node"`, `"target": "ES2022"`,
  `"outDir": "dist"`, `"rootDir": "."`, `include` covering `src/**/*` and `tests/**/*`
  (CommonJS chosen to match `@playwright/test`'s default TS loading with no extra ESM config)
- [X] T005 Configure npm scripts in `package.json` (depends on T003): `"build": "tsc --noEmit"`,
  `"test:ui": "playwright test tests/ui"`, `"test:api": "playwright test tests/api"`,
  `"test": "playwright test"`, `"report": "serenity-bdd run"` replaced with the html-reporter
  open command (e.g. `"report": "open reports/serenity-js/index.html"`-equivalent
  cross-platform opener, or simply document the generated path if no opener package is added)
- [X] T006 [P] Configure environment handling: `src/config/env.ts` (reads `BASE_URL`,
  `API_BASE_URL`, `HEADLESS` from `process.env` with safe defaults) and `.env.example`
  (`BASE_URL=https://todomvc.com/examples/react/dist/`,
  `API_BASE_URL=https://jsonplaceholder.typicode.com`, `HEADLESS=true`)
- [X] T007 [P] Configure `.gitignore` at repo root: `node_modules/`, `dist/`,
  `reports/serenity-js/`, `test-results/`, `.env`
- [X] T008 Verify clean install: run `npm install`, `npx playwright install chromium`, confirm
  exit code 0 for both (depends on T001–T007)

**Checkpoint**: Project installs cleanly and compiles (no source files yet, so `npm run build`
trivially succeeds).

---

## Phase 2: Serenity/JS Foundation (Foundational — blocks all user stories)

**Purpose**: Wire Playwright Test + Serenity/JS together with reporting, and prove one
executable test round-trips before any Screenplay abstractions exist.

- [X] T009 Create `playwright.config.ts`: `testDir: './tests'`, two `projects` entries
  (`ui`, `api`) pointing at `tests/ui` and `tests/api`, `use.baseURL` from
  `src/config/env.ts` (depends on T004, T006)
- [X] T010 Configure Serenity/JS test execution in `playwright.config.ts`: import
  `@serenity-js/playwright-test`'s `test`/`defineConfig` helpers so the `actorCalled` fixture
  is available in spec files (depends on T009)
- [X] T011 Configure reporting in `playwright.config.ts`: register `@serenity-js/console-reporter`
  and `@serenity-js/html-reporter` (with `Photographer` `strategy: 'TakePhotosOfFailures'`) as
  the Serenity/JS stage crew, output directory `reports/serenity-js/` (depends on T010)
- [X] T012 Verify a minimal executable test: `tests/ui/_smoke.spec.ts` — an inline
  `actorCalled('Alice').whoCan(BrowseTheWebWithPlaywright.using(browser))` navigates to
  `BASE_URL` and asserts the page loads (`Ensure.that(Page.current().title(), not(equals('')))`
  );run `npm run test:ui` and confirm a report is written to `reports/serenity-js/` (depends on
  T011). Delete `_smoke.spec.ts` once Phase 4's real first scenario exists (superseded by T023).

**Checkpoint**: One real Serenity/JS-reported Playwright Test execution proves the toolchain
end-to-end before any business Tasks are written.

---

## Phase 3: Screenplay Core (Foundational — blocks user story phases)

**Purpose**: Establish the shared Actor/Ability/naming conventions every scenario will use.
Per Constitution Principle X, this is intentionally thin — no generic base classes, no
factories/DI beyond what Serenity/JS already provides.

- [X] T013 [P] Implement Actor setup: `src/actors/actors.ts`. **Deviation from original plan**:
  Serenity/JS's default Playwright Test actor cast already assigns `BrowseTheWebWithPlaywright`
  (bound to the `page` fixture) and `CallAnApi` (bound to the project's `baseURL`) to every
  actor automatically — a custom `Cast` subclass would only reimplement that (Constitution
  Principle X). `actors.ts` instead exports `DEFAULT_ACTOR_NAME`, wired into
  `playwright.config.ts`'s `defaultActorName`, so the actor's name is declared in one place
- [X] T014 [P] Configure browser Ability: **merged into T015's `src/abilities/index.ts`**. No
  factory wrapper is needed — the default cast already provides `BrowseTheWebWithPlaywright`
  bound to Playwright Test's `page`/`headless` config, so there is no direct `Page`/`Browser`
  construction anywhere in `src/` to wrap (data-model.md Ability validation rule satisfied
  trivially)
- [X] T015 [P] Configure API Ability: `src/abilities/index.ts` documents that `CallAnApi` also
  comes from the default cast (bound to the project's `baseURL`); no custom factory or direct
  HTTP client construction exists outside this documented decision
- [X] T016 [P] Establish Task conventions: `src/tasks/index.ts` barrel file with a header
  comment (Tasks represent business intent, `performAs(actor)`, composed of Interactions/other
  Tasks only, no low-level operations — Constitution Principle II); re-exports `OpenApplication`
  and `AddItemToList` added in Phase 4
- [X] T017 [P] Establish Interaction conventions: `src/interactions/index.ts` barrel file with a
  header comment (only add an Interaction here when no `@serenity-js/web`/`@serenity-js/rest`
  primitive covers the need — Constitution Principle X); no custom Interaction has been needed
- [X] T018 [P] Establish Question conventions: `src/questions/index.ts` barrel file with a
  header comment (Questions are read-only, answered via `actor.answer(...)` or inline in
  `Ensure.that(...)`, reusable across scenarios — FR-014); re-exports `ListItemNames` added in
  Phase 4
- [X] T019 [P] Establish assertion conventions: `tests/README.md` — short shared note for both
  `tests/ui/` and `tests/api/` stating all scenario assertions MUST use
  `Ensure.that(question, expectation)` from `@serenity-js/assertions`, never a framework-native
  assertion (e.g., raw Playwright `expect(locator)`) that bypasses the Screenplay model

**Checkpoint**: Actor/Ability construction and Task/Interaction/Question/Assertion conventions
exist and are documented, but no business Tasks exist yet — ready for the first vertical slice.

---

## Phase 4: UI Vertical Slice — first scenario (User Story 2, P2) 🎯 MVP

**Goal**: One complete Actor → Ability → Task → Interaction → Question → Assertion → Report
chain for a real UI scenario against TodoMVC.

**Independent Test** (spec.md US2): Run the UI demonstration scenario and observe the browser
driven end-to-end with a reported pass/fail outcome.

- [X] T020 [P] [US2] Implement `OpenApplication` Task in `src/tasks/OpenApplication.ts`
  (composes `Navigate.to(env.baseUrl)` from `@serenity-js/web`) — FR-004. **Note**:
  `Navigate.to(env.baseUrl)` (absolute) is used rather than `Navigate.to('/')` — a
  root-relative path resolves against the *origin* of the project's `baseURL`, which would
  silently drop the `/examples/react/dist/` path segment and load the wrong page
- [X] T021 [P] [US2] Implement `AddItemToList` Task in `src/tasks/AddItemToList.ts` (composes
  `Enter.theValue(text).into(newTodoInput)` + `Press.the(Key.Enter).in(newTodoInput)` from
  `@serenity-js/web`) — FR-004, FR-005
- [X] T022 [P] [US2] Implement `ListItemNames` Question in `src/questions/ListItemNames.ts`
  (`PageElements.located(By.css('.todo-list li label')).eachMappedTo(Text)`, the visible todo
  item labels) — FR-006
- [X] T023 [US2] Implement the first UI scenario test in `tests/ui/add-item.spec.ts`: Actor
  performs `OpenApplication` then `AddItemToList('Buy milk')`, then
  `Ensure.that(ListItemNames(), containAtLeastOneItemThat(equals('Buy milk')))` (depends on
  T020–T022; deleted `tests/ui/_smoke.spec.ts` from T012 as part of this task)
- [X] T024 [US2] Verify scenario 1 end-to-end: ran `npm run test:ui`, scenario passes (Actor
  navigates, enters value, presses Enter, assertion passes) and a Serenity/JS report entry is
  produced (depends on T023)

**Checkpoint**: First UI scenario passes and reports — proves the pattern for the UI channel.

---

## Phase 5: API Vertical Slice — first scenario (User Story 3, P3)

**Goal**: One complete Actor → Ability → Task → Interaction → Question → Assertion → Report
chain for a real API scenario against JSONPlaceholder. Independent of Phase 4 (different
channel/Ability) — **may be implemented in parallel with Phase 4** once Phase 3 is complete.

**Independent Test** (spec.md US3): Run the API demonstration scenario and observe requests
executed and responses evaluated independently of any browser.

- [X] T025 [US3] Implement `GetPost` Task in `src/tasks/GetPost.ts` (composes
  `Send.a(GetRequest.to('/posts/{id}'))` from `@serenity-js/rest`, parameterised by post id) —
  FR-004, FR-005
- [X] T026 [US3] Implement the first API scenario test in `tests/api/get-post.spec.ts`: Actor
  performs `GetPost(1)`, then `Ensure.that(LastResponse.status(), equals(200))` and
  `Ensure.that(LastResponse.body<Post>().id, equals(1))`. **Note**: used `LastResponse.body<Post>()`'s
  proxied property access directly rather than the `property(...)` matcher — it's the pattern
  shown in `@serenity-js/rest`'s own docs and needs no extra import (Constitution Principle X)
  (depends on T025)
- [X] T027 [US3] Verify scenario 1 end-to-end: ran `npm run test:api`, scenario passes (Actor
  sends GET request, status and body assertions pass) and a Serenity/JS report entry is
  produced (depends on T026)

**Checkpoint**: First API scenario passes and reports — proves the pattern works beyond the
browser channel (US3 independent test satisfied).

---

## Phase 6: Additional Demonstration Scenarios (completes US2/US3; delivers US4)

**Goal**: A second independent scenario per channel (satisfying FR-008/FR-009's "at least two"
requirement), plus an explicit, verifiable demonstration of Task and Question reuse (US4,
FR-014).

**Independent Test** (spec.md US4): Identify a Task or Question used by more than one
demonstration scenario and confirm no duplicate implementation exists for it.

- [X] T028 [P] [US2] Implement `CompleteItem` Task in `src/tasks/CompleteItem.ts` (composes
  `Click.on(todoItemCheckbox)` from `@serenity-js/web`, located via
  `By.css('.toggle').of(By.cssContainingText('li', itemName))`) — the "equivalent second UI
  Task" named in data-model.md
- [X] T029 [P] [US2] Implement `ItemCompletionState` Question in
  `src/questions/ItemCompletionState.ts` (`Question.about` reading `CssClasses.of(...)` on the
  named item's `<li>` and checking for the `completed` class) — FR-006
- [X] T030 [US2] Implement the second UI scenario test in `tests/ui/complete-item.spec.ts`:
  Actor reuses `OpenApplication` + `AddItemToList('Walk the dog')` (same implementations as
  T023, not duplicated), then performs `CompleteItem('Walk the dog')`, then
  `Ensure.that(ItemCompletionState('Walk the dog'), isTrue())` (depends on T028, T029, and
  T023's Tasks existing)
- [X] T031 [P] [US3] Implement `CreatePost` Task in `src/tasks/CreatePost.ts` (composes
  `Send.a(PostRequest.to('/posts').with({ title, body, userId }))` from `@serenity-js/rest`) —
  the second API Task named in data-model.md
- [X] T032 [US3] Implement the second API scenario test in `tests/api/create-post.spec.ts`:
  Actor performs `CreatePost(...)`, then `Ensure.that(LastResponse.status(), equals(201))` and
  `Ensure.that(LastResponse.body<Post>().title, equals(...))` (reuses the same
  `LastResponse.body<T>()` proxied-property pattern as T026, not a duplicate) (depends on T031)
- [X] T033 [US4] Verified the reusable Task demonstration: `OpenApplication` and
  `AddItemToList` are invoked, unchanged, from both `tests/ui/add-item.spec.ts` and
  `tests/ui/complete-item.spec.ts` with a single implementation in `src/tasks/` — confirmed via
  `grep` inspection, no code changes (depends on T023, T030)
- [X] T034 [US4] Verified the reusable Question demonstration: the built-in `LastResponse`
  Questions are used, unchanged, from both `tests/api/get-post.spec.ts` and
  `tests/api/create-post.spec.ts` — confirmed via `grep` inspection, no code changes (depends
  on T026, T032)

**Checkpoint**: All 4 demonstration scenarios (2 UI + 2 API) pass; reuse is demonstrated, not
just asserted in documentation (FR-014 satisfied).

---

## Phase 7: Reporting (User Story 5, P5)

**Goal**: Confirm the Execution Report satisfies FR-011/NFR-005 for both success and failure
paths. No new source files — this phase verifies Phase 1–6 output.

**Independent Test** (spec.md US5): Run the demonstration suite, generate the report, and
confirm it lists scenario, Actor, Tasks, interactions, assertions, and outcome for each test.

- [X] T035 [US5] Verified successful execution reporting: ran `npm test`, `reports/serenity-js/summary.json`
  shows `passed: 4, failed: 0`; console reporter output for every scenario shows the Actor name
  ("Alice"), an ordered Task/Interaction/Question/Assertion activity tree, and outcome (depends
  on Phase 6 complete)
- [X] T036 [US5] Verified failed assertion reporting: temporarily changed the expected value in
  `tests/ui/add-item.spec.ts` from `'Buy milk'` to `'Buy bread'`, re-ran `npm run test:ui` —
  console reporter printed an `AssertionError` identifying the failing
  `containAtLeastOneItemThat(equals('Buy bread'))` expectation with expected/received values,
  and `reports/serenity-js/summary.json` recorded `passed: 1, failed: 1`; reverted the change
  and confirmed both scenarios pass again (depends on T035)
- [X] T037 [US5] Verified UI failure evidence capture: while the temporary failure from T036 was
  in place, `reports/serenity-js/test-runs/<run>/` contained a
  `screenshot-*-alice-ensures-that-the-list-item-*.png` file captured by `Photographer` at the
  point of failure; reverted afterward (depends on T036)
- [X] T038 [US5] Verified single-command report generation: `npm run report` ran
  `html-reporter serve --dir reports/serenity-js --open` and served the already-generated
  report at `http://localhost:8080` with no manual post-processing step (depends on T035)

**Checkpoint**: Reporting satisfies FR-011, NFR-005, SC-006 for both pass and fail paths.

---

## Phase 8: Documentation (User Story 1, P1)

**Goal**: A reader unfamiliar with the codebase can understand the Screenplay flow from
`README.md` and one example test alone (FR-012, FR-013, SC-001).

**Independent Test** (spec.md US1): A QA engineer reads an example test and README and
correctly describes the Actor and business goal without opening Interaction code.

All tasks below edit the same file sequentially (no `[P]`):

- [X] T039 [US1] Write README.md purpose & architecture overview section in `README.md`
  (what StageCraft is, why Serenity/JS, link to constitution.md)
- [X] T040 [US1] Write README.md Screenplay concepts section in `README.md` (Actor, Ability,
  Task, Interaction, Question, Assertion, Execution Report — one paragraph each, referencing
  `data-model.md`'s definitions and their `src/` locations)
- [X] T041 [US1] Write README.md project structure section in `README.md` (folder tree mirrored
  from plan.md's Project Structure)
- [X] T042 [US1] Write README.md UI example walkthrough in `README.md` (annotated excerpt of
  `tests/ui/add-item.spec.ts` explaining each Screenplay step)
- [X] T043 [US1] Write README.md API example walkthrough in `README.md` (annotated excerpt of
  `tests/api/get-post.spec.ts`)
- [X] T044 [US1] Write README.md data flow section in `README.md` (Actor → Ability → Task →
  Interaction → System Under Test → Question → Assertion → Execution Report, as a mermaid
  diagram)
- [X] T045 [US1] Write README.md execution commands section in `README.md` (`npm install`,
  `npx playwright install chromium`, `npm run build`, `npm run test:ui`, `npm run test:api`,
  `npm test`, `npm run report`)
- [X] T046 [US1] Write README.md reporting section in `README.md` (how to read the HTML report,
  where screenshots appear on failure)
- [X] T047 [US1] Write README.md scalability section in `README.md` (how a new interaction
  channel, e.g. database or messaging, would add a new Ability + Interaction set without
  redesigning Actor/Task/Question — Constitution Principle XI, SC-007)

**Checkpoint**: README + example tests satisfy US1's independent test.

---

## Phase 9: Validation (Polish — cross-cutting, User Story 6, P6)

**Goal**: Prove the complete, documented, installable solution end-to-end from a clean
checkout (US6), and confirm alignment with the constitution, spec, and plan.

**Independent Test** (spec.md US6): From a clean environment, following only documented
commands, install → execute → report with no undocumented manual steps.

- [ ] T048 [US6] Verify strict TypeScript compilation: `npm run build` exits 0 with zero errors
  (depends on Phase 6 complete)
- [ ] T049 Verify lint/static checks: this project has no separate linter configured — `tsc
  --strict` (T048) is the static check; note this explicitly if a linter is added later
- [ ] T050 [US6] Run UI test execution: `npm run test:ui` — both UI scenarios pass (depends on
  T048)
- [ ] T051 [US6] Run API test execution: `npm run test:api` — both API scenarios pass (depends
  on T048)
- [ ] T052 [US6] Run complete suite execution: `npm test` — all 4 scenarios pass in one run/one
  report (depends on T050, T051)
- [ ] T053 [US6] Generate the final execution report: `npm run report`, manually confirm it
  lists scenario/Actor/Tasks/Interactions/Questions/Assertions/outcome for all 4 scenarios
  (depends on T052)
- [ ] T054 [US6] Clean installation validation: delete `node_modules/`, `dist/`,
  `reports/serenity-js/`, `test-results/`; re-run `npm install`,
  `npx playwright install chromium`, `npm run build`, `npm test`, `npm run report` from that
  clean state (quickstart.md Steps 1–7) (depends on T053)
- [ ] T055 [P] Verify no secrets committed: confirm `.env` is git-ignored, only `.env.example`
  (public defaults) is tracked, `git status`/`git diff` show no credential-like values
- [ ] T056 [P] Verify constitution compliance: re-check plan.md's Constitution Check table
  (Principles I–XIV) against the final `src/`/`tests/` implementation, note any drift in
  `plan.md` if found
- [ ] T057 [P] Verify specification coverage: cross-reference `spec.md`'s FR-001–FR-015,
  NFR-001–NFR-006, and SC-001–SC-008 against the implementation, confirming each is satisfied
- [ ] T058 [P] Verify plan/task alignment: confirm this `tasks.md` fully implements `plan.md`'s
  Project Structure and Technical Context with no unplanned deviations

**Checkpoint**: All spec success criteria (SC-001–SC-008) are demonstrably met from a clean
checkout using only documented commands.

---

## Dependencies & Execution Order

```
Phase 1 (Setup)
   ↓
Phase 2 (Serenity/JS Foundation)
   ↓
Phase 3 (Screenplay Core)
   ↓
   ├── Phase 4 (US2: UI scenario 1) ──┐
   └── Phase 5 (US3: API scenario 1) ─┤  independent channels, may run in parallel
                                       ↓
                              Phase 6 (US2/US3 second scenarios + US4 reuse proof)
                                       ↓
                    ┌──────────────────┼──────────────────┐
             Phase 7 (US5: Reporting)  |          Phase 8 (US1: Documentation)
                    └──────────────────┴──────────────────┘
                                       ↓
                          Phase 9 (US6: Validation, final gate)
```

- Phases 1–3 are strictly sequential and block every user story (shared infrastructure).
- Phase 4 (US2) and Phase 5 (US3) depend only on Phase 3 and are independent of each other —
  they touch disjoint files/Abilities and may be assigned to different agents/sessions in
  parallel, though the phase numbering above follows spec.md's priority order (P2 before P3).
- Phase 6 depends on **both** Phase 4 and Phase 5 (needs a first scenario in each channel to
  extend and to prove reuse against).
- Phase 7 and Phase 8 both depend on Phase 6 but touch disjoint files (`playwright.config.ts`/
  reports vs. `README.md`) and may run in parallel.
- Phase 9 depends on everything before it — it is the final acceptance gate.

## Parallel Execution Examples

Within Phase 3 (all different files):
```
T013 src/actors/Actors.ts
T014 src/abilities/browseTheWeb.ts
T015 src/abilities/callAnApi.ts
T016 src/tasks/index.ts
T017 src/interactions/index.ts
T018 src/questions/index.ts
T019 tests/README.md
```

Within Phase 4 (before the test file that uses them):
```
T020 src/tasks/OpenApplication.ts
T021 src/tasks/AddItemToList.ts
T022 src/questions/ListItemNames.ts
```

Across phases: Phase 4 (T020–T024) and Phase 5 (T025–T027) may proceed at the same time once
Phase 3 is complete.

## Implementation Strategy

**MVP = Phases 1–4** (through T024): a fully installed, strictly-typed project with one
passing, reported UI scenario. This already satisfies US1's independent test (a reader can
read `tests/ui/add-item.spec.ts` and describe the Actor/Task) and fully satisfies US2.

**Incremental delivery** from there: Phase 5 adds the API channel (US3) → Phase 6 completes
both channels to "two scenarios each" and proves reuse (US4) → Phase 7 hardens reporting (US5)
→ Phase 8 documents the result (US1 fully) → Phase 9 is the final, whole-project acceptance
gate (US6) run from a clean checkout.

Stop after any checkpoint and the project remains in a working, demonstrable state — no phase
leaves the suite broken for the next.
