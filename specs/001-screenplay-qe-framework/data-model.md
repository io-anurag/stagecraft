# Phase 1 Data Model: Screenplay-Based Quality Engineering Framework

This feature has no persistent data storage (see Technical Context: Storage = N/A). The
"entities" below are the Screenplay architectural components identified in the spec's Key
Entities section, expressed as the contracts/shapes the implementation must honor. These are
conceptual/type contracts, not database entities.

## Actor

**Represents**: Who performs a scenario.

**Provided by**: `@serenity-js/core` (`Actor`, `actorCalled`) — not reimplemented.

**Fields/Shape**:
- `name: string` — e.g., `"Alice"` (QA User persona), assigned via `actorCalled('Alice')`.
- `abilities: Ability[]` — assigned via `.whoCan(...)`, e.g.,
  `BrowseTheWebWithPlaywright.using(...)`, `CallAnApi.at(...)`.

**Relationships**: An Actor performs Tasks (`actor.attemptsTo(...)`) and answers Questions
(`actor.answer(...)`); an Actor has zero or more Abilities.

**Validation rules**: An Actor MUST NOT be created without at least one Ability relevant to the
Task it is about to perform (FR-002, FR-003; Edge Case: missing Ability surfaces a clear error —
this is Serenity/JS's built-in behavior when an unsupported Ability is requested).

## Ability

**Represents**: What an Actor is capable of doing.

**Provided by**: `@serenity-js/playwright` (`BrowseTheWebWithPlaywright`) for UI,
`@serenity-js/rest` (`CallAnApi`) for API — not reimplemented (FR-003, Constitution Principle
III).

**Fields/Shape**:
- UI: `BrowseTheWebWithPlaywright.using(browser, contextOptions?)` — wraps a Playwright
  `Browser`/`BrowserContext`.
- API: `CallAnApi.at(baseURL: string)` — wraps an Axios instance scoped to `API_BASE_URL`.

**Relationships**: Consumed by Interactions (e.g., `Navigate`, `Click` consume the browsing
Ability; `Send` consumes the API Ability); assigned to exactly the Actors that need it.

**Validation rules**: StageCraft code MUST NOT instantiate a Playwright `Page` or an HTTP client
directly inside a Task or test file — Abilities are the only place a low-level client is
constructed (plan input: "The test specification should not directly instantiate low-level
browser or HTTP clients").

## Task

**Represents**: A meaningful, business-oriented goal.

**Examples** (from plan input, mapped to this feature's two channels):
- UI: `OpenApplication`, `AddItemToList` (or equivalent second UI Task).
- API: `GetPost`, `CreatePost`.

**Fields/Shape**: Each Task is a class/function implementing Serenity/JS's `Task` interface
(`performAs(actor): Promise<void>`), composed of one or more Interactions and/or other Tasks.

**Relationships**: Composed of Interactions (FR-005); may compose other Tasks (Constitution
Principle IV — Composition and Reusability); performed by an Actor.

**Validation rules**: A Task MUST represent a business action, not a single low-level operation
(FR-004; Constitution Principle II — no `clickButton`-style Tasks). At least one Task per channel
MUST be reused across more than one scenario (FR-014) — see `quickstart.md` for which Task/
Question is reused and how to verify it.

## Interaction

**Represents**: A single low-level operation required to perform a Task.

**Examples**: `Navigate.to(url)`, `Click.on(target)`, `Enter.theValue(text).into(target)` (from
`@serenity-js/web`); `Send.a(GetRequest.to(path))` (from `@serenity-js/rest`). StageCraft only
adds a new Interaction class when no existing Serenity/JS primitive covers the need (plan
input: "Use Serenity/JS primitives ... instead of unnecessarily wrapping every built-in
interaction").

**Fields/Shape**: Implements Serenity/JS's `Interaction` interface (`performAs(actor):
Promise<void>`).

**Relationships**: Used by one or more Tasks; operates directly against the System Under Test
via an Ability.

**Validation rules**: Interactions MUST remain low-level and MUST NOT encode business intent
(that belongs in Tasks) — Constitution Principle V (Separation of Concerns).

## Question

**Represents**: Retrieves a specific piece of state/information from the System Under Test.

**Examples**:
- UI: `Page.current().title()`, a custom `ListItemNames` Question over TodoMVC's list items.
- API: `LastResponse.status()`, `LastResponse.body()` (from `@serenity-js/rest`).

**Fields/Shape**: Implements Serenity/JS's `QuestionAdapter<T>`/`Question<Promise<T>>` contract,
answered via `actor.answer(question)` or directly inside `Ensure.that(question, expectation)`.

**Relationships**: Consumed by Assertions; MAY be reused across multiple scenarios (FR-014,
User Story 4).

**Validation rules**: Questions MUST NOT perform state-changing operations (query-only,
Constitution Principle V); at least one Question MUST be demonstrably reused across more than
one scenario within a channel (FR-014).

## Assertion

**Represents**: Verifies an expected outcome.

**Provided by**: `@serenity-js/assertions` (`Ensure.that(question, expectation)` plus
expectation matchers like `equals`, `includes`, `startsWith`).

**Fields/Shape**: `Ensure.that<T>(actual: Question<Promise<T>> | T, expectation: Expectation<T>):
Interaction` — itself an Interaction that throws an `AssertionError`-style failure when the
expectation is not met, which Serenity/JS reporters capture as a failed scenario with diagnostic
detail (FR-007, NFR-005).

**Relationships**: Always evaluated against a Question's answer; the final step of a scenario's
Screenplay flow before the Execution Report is produced.

**Validation rules**: Test specifications MUST use `Ensure`/Question-based assertions rather
than framework-native assertions (e.g., raw Playwright `expect` on a locator) bypassing the
Screenplay model (plan input: "Questions should be used by assertions rather than bypassed").

## Execution Report

**Represents**: The structured record of a test run.

**Provided by**: `@serenity-js/html-reporter` (primary, FR-011) + `@serenity-js/console-reporter`
(secondary, immediate feedback), configured as Serenity/JS "stage crew" in
`playwright.config.ts`.

**Fields/Shape**: Per scenario — title, Actor name, ordered activity tree (Tasks → Interactions
→ Questions → Assertions), outcome (passed/failed/skipped), duration, and (for UI failures)
attached screenshot evidence via Photographer (`strategy: 'TakePhotosOfFailures'`).

**Relationships**: Generated from the combined output of all executed scenarios; not
hand-authored.

**Validation rules**: The report MUST be generated by running a single documented npm script
(FR-013); MUST NOT require any manual post-processing step beyond `npm run report` (User Story
5, SC-006).
