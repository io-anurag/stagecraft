import { defineConfig } from '@playwright/test';
import type { PlaywrightTestConfig, SerenityFixtures, SerenityWorkerFixtures } from '@serenity-js/playwright-test';
import { Photographer, TakePhotosOfFailures } from '@serenity-js/web';

import { DEFAULT_ACTOR_NAME } from './src/actors/actors';
import { env } from './src/config/env';

// Single Playwright Test config serves both the UI and API channels (FR-010) —
// only `baseURL` differs per project; the Serenity/JS reporter/crew is shared.
const config: PlaywrightTestConfig<SerenityFixtures, SerenityWorkerFixtures> = {
    testDir: './tests',

    // Headed runs launch a visible browser per worker — cap at 1 so only a single window opens.
    workers: env.headless ? undefined : 1,

    reporter: [
        ['@serenity-js/playwright-test', {
            crew: [
                '@serenity-js/console-reporter',
                ['@serenity-js/html-reporter', { outputDirectory: 'reports/serenity-js' }],
            ],
        }],
    ],

    use: {
        crew: [
            Photographer.whoWill(TakePhotosOfFailures),
        ],
        headless: env.headless,
        defaultActorName: DEFAULT_ACTOR_NAME,
    },

    projects: [
        {
            name: 'ui',
            testDir: './tests/ui',
            use: { baseURL: env.baseUrl },
        },
        {
            name: 'api',
            testDir: './tests/api',
            // @serenity-js/playwright-test always launches a worker-scoped browser (even for
            // API-only actors), but api tests never render it — force headless so no window pops up.
            use: { baseURL: env.apiBaseUrl, headless: true },
        },
    ],
};

export default defineConfig(config);
