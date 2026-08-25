import { Task } from '@serenity-js/core';
import { Navigate } from '@serenity-js/web';

import { env } from '../config/env';

/** Navigates to a fresh instance of the application. */
export const OpenApplication = () =>
    Task.where(`#actor opens the application`,
        // env.baseUrl (not '/') is used since a root-relative path would drop its path segment.
        Navigate.to(env.baseUrl),
    );
