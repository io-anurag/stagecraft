# Test conventions

Scenarios in `tests/ui/` and `tests/api/` follow one shared assertion rule: every check
of application/response state MUST use `Ensure.that(question, expectation)` from
`@serenity-js/assertions`. Never assert using a framework-native mechanism (e.g. a raw
Playwright `expect(locator)` or `expect(response)`) — Questions are the only way a
scenario reads state, so assertions must go through them too.

```ts
import { Ensure, equals, includes } from '@serenity-js/assertions';

await actor.attemptsTo(
    Ensure.that(SomeQuestion(), equals('expected value')),
);
```
