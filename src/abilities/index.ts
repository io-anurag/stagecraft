// StageCraft never constructs a Playwright `Page`/`Browser` or an HTTP client directly.
// Every actor's `BrowseTheWebWithPlaywright` and `CallAnApi` Abilities come from
// Serenity/JS's default Playwright Test actor cast (see playwright.config.ts and
// src/actors/actors.ts) — this file is the single documented location for that decision
// (data-model.md, Ability entity: "no direct Page/HTTP client construction outside here").
export {};
