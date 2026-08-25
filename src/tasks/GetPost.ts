import { Task } from '@serenity-js/core';
import { GetRequest, Send } from '@serenity-js/rest';

// Business intent: retrieve a specific post from the API (FR-004, FR-005).
export const GetPost = (id: number) =>
    Task.where(`#actor retrieves post ${id}`,
        Send.a(GetRequest.to(`/posts/${id}`)),
    );
