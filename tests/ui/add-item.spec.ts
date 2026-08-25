import { containAtLeastOneItemThat, Ensure, equals } from '@serenity-js/assertions';
import { it } from '@serenity-js/playwright-test';

import { AddItemToList, OpenApplication } from '../../src/tasks';
import { ListItemNames } from '../../src/questions';

it('adds an item to the list', async ({ actor }) => {
    await actor.attemptsTo(
        OpenApplication(),
        AddItemToList('Buy milk'),

        Ensure.that(ListItemNames(), containAtLeastOneItemThat(equals('Buy milk'))),
    );
});
