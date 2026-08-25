import { Ensure, equals } from '@serenity-js/assertions';
import { it } from '@serenity-js/playwright-test';
import { LastResponse } from '@serenity-js/rest';

import { GetPost } from '../../src/tasks';

interface Post {
    id: number;
}

it('retrieves a post', async ({ actor }) => {
    await actor.attemptsTo(
        GetPost(1),

        Ensure.that(LastResponse.status(), equals(200)),
        Ensure.that(LastResponse.body<Post>().id, equals(1)),
    );
});
