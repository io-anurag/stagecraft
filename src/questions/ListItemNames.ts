import { By, PageElements, Text } from '@serenity-js/web';

// Reusable across UI scenarios (FR-006, FR-014): the names of items currently visible
// on the actor's list.
export const ListItemNames = () =>
    PageElements.located(By.css('.todo-list li label'))
        .eachMappedTo(Text)
        .describedAs('the list item names');
