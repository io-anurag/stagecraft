import { By, PageElements, Text } from '@serenity-js/web';

/** Answers with the names of items currently visible on the list. */
export const ListItemNames = () =>
    PageElements.located(By.css('.todo-list li label'))
        .eachMappedTo(Text)
        .describedAs('the list item names');
