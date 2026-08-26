# StageCraft Constitution

## Core Principles

### I. Screenplay Pattern First

The Screenplay Pattern is the foundational architectural pattern of StageCraft. The
implementation MUST clearly separate Actor, Ability, Task, Interaction, Question, and
Assertion as distinct concepts. Tests MUST express business/user intent rather than
low-level automation mechanics wherever reasonably possible. The framework MUST NOT
become a disguised Page Object Model or a collection of generic automation utilities.
Technical implementation details live beneath the Screenplay abstraction, never in the
test scenario itself.

### II. Intent Over Implementation

Test scenarios MUST communicate what the Actor is trying to accomplish. Tests SHOULD
prefer intent-revealing concepts such as `Login`, `SearchForProduct`, `CreateUser`,
`RetrievePost`, or `VerifyDashboard` over low-level actions such as `clickButton`,
`findElement`, `typeText`, or `waitForElement`. Low-level browser or API operations
MUST be encapsulated by Tasks, Interactions, Abilities, and Questions rather than
appearing directly in test scenarios.

### III. Technology-Agnostic Screenplay Architecture

The Screenplay model MUST remain independent from any specific interaction technology
wherever practical. The architecture MUST support multiple interaction channels — UI/
browser, API, and future database or messaging interactions — without redefining the
core Actor/Task/Question model. The conceptual model of Actors, Tasks, and Questions
MUST remain consistent regardless of which channel a given Ability targets.

### IV. Composition and Reusability

Tasks, Interactions, Questions, and Abilities MUST be designed for composition and
reuse. New business workflows MUST preferably be assembled from existing Screenplay
components instead of duplicating implementation logic. Unnecessary inheritance
hierarchies and generic base classes MUST be avoided; favor composition of small,
focused components over deep class hierarchies.

### V. Separation of Concerns

Each Screenplay component MUST have a single, clearly defined responsibility:
- **Actor** — represents who performs the scenario.
- **Ability** — represents what the Actor is capable of doing.
- **Task** — represents a meaningful goal or business action.
- **Interaction** — represents a low-level operation required to perform a Task.
- **Question** — retrieves information from the system under test.
- **Assertion** — verifies an expected outcome.

No component may silently absorb responsibilities belonging to another.

### VI. Readability

A QA engineer unfamiliar with the implementation details MUST be able to understand
the intent of a test by reading its scenario alone. Expressive names and
business-oriented terminology MUST be preferred over generic or mechanical naming.
Code readability takes priority over excessive abstraction.

### VII. Type Safety

The framework MUST use strict TypeScript. Unnecessary use of `any` MUST be avoided.
Reusable framework components MUST expose meaningful types and contracts.
Compilation errors MUST be treated as implementation defects — they MUST NOT be
suppressed through weak typing or type assertions used to bypass the compiler.

### VIII. Testability

The framework itself MUST be testable. The implementation MUST provide deterministic,
repeatable examples demonstrating UI automation, API automation, successful
assertions, and failure diagnostics. The framework SHOULD avoid unnecessary
dependencies on unstable external systems that would make example tests flaky.

### IX. Observable Execution

Test execution MUST produce meaningful execution evidence. The framework MUST
integrate structured reporting so that the execution of Actors, Tasks, Interactions,
Questions, and Assertions can be understood from the generated report without reading
source code.

### X. Simplicity Before Abstraction

StageCraft is intentionally a small reference implementation. Architectural
complexity MUST NOT be introduced unless it provides a clear, demonstrable benefit.
The following MUST be avoided unless explicitly justified: unnecessary base classes,
generic framework wrappers, excessive factories, unnecessary dependency injection,
utility classes that duplicate existing library functionality, and abstractions
created only to make the architecture appear sophisticated.

### XI. Scalable Architecture

Although the initial implementation is intentionally small, architectural decisions
MUST allow the framework to grow without fundamental restructuring. The design MUST
permit future support for additional UI applications, additional APIs, database
interactions, messaging systems, authentication mechanisms, multiple Actors, multiple
environments, parallel execution, CI/CD execution, and AI-assisted Quality
Engineering workflows. Scalability considerations MUST NOT be used to justify
premature complexity (see Principle X).

### XII. Specification and Implementation Alignment

Implementation MUST be traceable to approved requirements and technical decisions.
Code MUST NOT introduce functionality that is outside the approved specification
without first updating the relevant specification, plan, and tasks.

### XIII. Verification Before Completion

An implementation is NOT considered complete merely because source files have been
generated. The implementation MUST be installable, compilable, executable, testable,
and reportable. The implementation process MUST verify the framework through actual
test execution, not through code review alone.

### XIV. Documentation as a First-Class Artifact

The repository MUST explain the Screenplay Pattern, StageCraft architecture, project
structure, UI flow, API flow, reporting, execution commands, and extension strategy.
Documentation MUST explain why architectural decisions were made, not merely list
files or commands.

## Governance

This constitution governs all implementation decisions for StageCraft and supersedes
ad-hoc practices where a conflict exists.

**Amendment procedure**: Any implementation that conflicts with a MUST requirement
requires either (1) modification of the implementation to comply, or (2) an explicit
amendment to this constitution. Amendments are proposed by editing this file,
recording the change in the Sync Impact Report at the top of the document, and
updating the version per the versioning policy below. When a technical constraint
requires a deviation from a MUST requirement, the deviation MUST be documented and
justified in the relevant plan or specification before implementation proceeds.

**Versioning policy**: This constitution follows semantic versioning:
- **MAJOR** — backward-incompatible governance changes, or removal/redefinition of an
  existing principle.
- **MINOR** — addition of a new principle or materially expanded guidance.
- **PATCH** — clarifications, wording, typo fixes, or non-semantic refinements.

**Compliance review**: All specifications, plans, and tasks MUST be checked against
these principles before implementation begins, and implementations MUST be verified
against them before being considered complete (see Principle XIII). Reviewers MUST
treat unexplained deviation from a MUST requirement as a defect rather than a stylistic
choice.

**Version**: 1.0.0 | **Ratified**: 2026-08-25 | **Last Amended**: 2026-08-25
