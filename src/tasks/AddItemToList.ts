import { Task } from '@serenity-js/core';
import { By, Enter, Key, PageElement, Press } from '@serenity-js/web';

const newTodoInput = () =>
    PageElement.located(By.css('.new-todo'))
        .describedAs('the new todo input');

// Business intent: record a new item on the actor's list (FR-004, FR-005).
export const AddItemToList = (itemName: string) =>
    Task.where(`#actor adds '${itemName}' to the list`,
        Enter.theValue(itemName).into(newTodoInput()),
        Press.the(Key.Enter).in(newTodoInput()),
    );
