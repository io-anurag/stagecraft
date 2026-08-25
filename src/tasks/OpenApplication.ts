import { Task } from '@serenity-js/core';
import { Navigate } from '@serenity-js/web';

import { env } from '../config/env';

// Business intent: arrive at a fresh instance of the application (FR-004).
// Navigate.to(env.baseUrl) is used instead of Navigate.to('/') because a root-relative
// path resolves against the *origin* of the project's baseURL, not its full path —
// which would drop the '/examples/react/dist/' segment of env.baseUrl entirely.
export const OpenApplication = () =>
    Task.where(`#actor opens the application`,
        Navigate.to(env.baseUrl),
    );
