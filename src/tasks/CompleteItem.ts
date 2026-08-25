import { Task } from '@serenity-js/core';
import { By, Click, PageElement } from '@serenity-js/web';

const todoItemCheckbox = (itemName: string) =>
    PageElement.located(By.css('.toggle'))
        .of(PageElement.located(By.cssContainingText('li', itemName)))
        .describedAs(`the '${itemName}' checkbox`);

/** Marks the named list item as complete. */
export const CompleteItem = (itemName: string) =>
    Task.where(`#actor completes '${itemName}'`,
        Click.on(todoItemCheckbox(itemName)),
    );
