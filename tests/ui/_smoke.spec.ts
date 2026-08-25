import { Ensure, equals, not } from '@serenity-js/assertions';
import { it } from '@serenity-js/playwright-test';
import { Navigate, Page } from '@serenity-js/web';

it('the demo application loads', async ({ actor }) => {
    await actor.attemptsTo(
        Navigate.to('/'),
        Ensure.that(Page.current().title(), not(equals(''))),
    );
});
