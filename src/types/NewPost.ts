import { Post } from './Post';

/** Payload for creating a post, before the server assigns its id. */
export type NewPost = Omit<Post, 'id'>;
