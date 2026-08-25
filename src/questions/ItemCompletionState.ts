import { AnswersQuestions, Question, UsesAbilities } from '@serenity-js/core';
import { By, CssClasses, PageElement } from '@serenity-js/web';

const todoItem = (itemName: string) =>
    PageElement.located(By.cssContainingText('li', itemName))
        .describedAs(`the '${itemName}' todo item`);

/** Answers whether the named list item is marked complete. */
export const ItemCompletionState = (itemName: string) =>
    Question.about(`whether '${itemName}' is complete`, async (actor: AnswersQuestions & UsesAbilities) => {
        const classes = await actor.answer(CssClasses.of(todoItem(itemName)));
        return classes.includes('completed');
    });
