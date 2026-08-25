import { Task } from '@serenity-js/core';
import { PostRequest, Send } from '@serenity-js/rest';

import { NewPost } from '../types/NewPost';

/** Creates a new post via the API. */
export const CreatePost = (post: NewPost) =>
    Task.where(`#actor creates a post titled '${post.title}'`,
        Send.a(PostRequest.to('/posts').with(post)),
    );
