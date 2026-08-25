// Serenity/JS's default Playwright Test actor cast already grants every actor
// BrowseTheWebWithPlaywright (bound to the `page` fixture) and CallAnApi (bound to the
// project's `baseURL`) — see playwright.config.ts's `ui`/`api` projects. No custom `Cast`
// is required to assign those Abilities (Constitution Principle X — Simplicity Before
// Abstraction): building one would just re-implement what Serenity/JS already provides.
//
// This module exists as the single place that names the default actor used across
// scenarios, so the name isn't duplicated/hard-coded in individual spec files.
export const DEFAULT_ACTOR_NAME = 'Alice';
