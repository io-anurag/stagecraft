import { Task } from '@serenity-js/core';
import { By, Enter, Key, PageElement, Press } from '@serenity-js/web';

const newTodoInput = () =>
    PageElement.located(By.css('.new-todo'))
        .describedAs('the new todo input');

/** Adds a new item with the given name to the actor's list. */
export const AddItemToList = (itemName: string) =>
    Task.where(`#actor adds '${itemName}' to the list`,
        Enter.theValue(itemName).into(newTodoInput()),
        Press.the(Key.Enter).in(newTodoInput()),
    );
