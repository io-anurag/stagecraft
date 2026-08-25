import { Task } from '@serenity-js/core';
import { PostRequest, Send } from '@serenity-js/rest';

interface NewPost {
    title: string;
    body: string;
    userId: number;
}

// Business intent: create a new post via the API (FR-004, FR-005).
export const CreatePost = (post: NewPost) =>
    Task.where(`#actor creates a post titled '${post.title}'`,
        Send.a(PostRequest.to('/posts').with(post)),
    );
