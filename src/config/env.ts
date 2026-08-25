import { StageCraftEnv } from './StageCraftEnv';

const DEFAULT_BASE_URL = 'https://todomvc.com/examples/react/dist/';
const DEFAULT_API_BASE_URL = 'https://jsonplaceholder.typicode.com';

/** Reads environment configuration from `process.env`, applying defaults for unset values. */
export function loadEnv(): StageCraftEnv {
    return {
        baseUrl: process.env.BASE_URL ?? DEFAULT_BASE_URL,
        apiBaseUrl: process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL,
        headless: (process.env.HEADLESS ?? 'true').toLowerCase() !== 'false',
    };
}

export const env: StageCraftEnv = loadEnv();
