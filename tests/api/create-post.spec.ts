import { Ensure, equals } from '@serenity-js/assertions';
import { it } from '@serenity-js/playwright-test';
import { LastResponse } from '@serenity-js/rest';

import { CreatePost } from '../../src/tasks';

interface Post {
    title: string;
}

it('creates a post', async ({ actor }) => {
    await actor.attemptsTo(
        CreatePost({ title: 'Serenity/JS', body: 'Screenplay Pattern', userId: 1 }),

        Ensure.that(LastResponse.status(), equals(201)),
        Ensure.that(LastResponse.body<Post>().title, equals('Serenity/JS')),
    );
});
