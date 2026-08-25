import { Task } from '@serenity-js/core';
import { GetRequest, Send } from '@serenity-js/rest';

/** Retrieves a post by id via the API. */
export const GetPost = (id: number) =>
    Task.where(`#actor retrieves post ${id}`,
        Send.a(GetRequest.to(`/posts/${id}`)),
    );
