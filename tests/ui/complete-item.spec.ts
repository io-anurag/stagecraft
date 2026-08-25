import { Ensure, isTrue } from '@serenity-js/assertions';
import { it } from '@serenity-js/playwright-test';

import { AddItemToList, CompleteItem, OpenApplication } from '../../src/tasks';
import { ItemCompletionState } from '../../src/questions';

it('completes an item on the list', async ({ actor }) => {
    await actor.attemptsTo(
        OpenApplication(),
        AddItemToList('Walk the dog'),
        CompleteItem('Walk the dog'),

        Ensure.that(ItemCompletionState('Walk the dog'), isTrue()),
    );
});
