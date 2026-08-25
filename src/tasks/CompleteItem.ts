import { Task } from '@serenity-js/core';
import { By, Click, PageElement } from '@serenity-js/web';

const todoItemCheckbox = (itemName: string) =>
    PageElement.located(By.css('.toggle'))
        .of(PageElement.located(By.cssContainingText('li', itemName)))
        .describedAs(`the '${itemName}' checkbox`);

// Business intent: mark an existing list item as done (FR-004, FR-005).
export const CompleteItem = (itemName: string) =>
    Task.where(`#actor completes '${itemName}'`,
        Click.on(todoItemCheckbox(itemName)),
    );
