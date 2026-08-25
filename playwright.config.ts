import { defineConfig } from '@playwright/test';
import type { PlaywrightTestConfig, SerenityFixtures, SerenityWorkerFixtures } from '@serenity-js/playwright-test';
import { Photographer, TakePhotosOfFailures } from '@serenity-js/web';

import { DEFAULT_ACTOR_NAME } from './src/actors/actors';
import { env } from './src/config/env';

// Single Playwright Test config serves both the UI and API channels (FR-010) —
// only `baseURL` differs per project; the Serenity/JS reporter/crew is shared.
const config: PlaywrightTestConfig<SerenityFixtures, SerenityWorkerFixtures> = {
    testDir: './tests',

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
            use: { baseURL: env.apiBaseUrl },
        },
    ],
};

export default defineConfig(config);
