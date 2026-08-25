// Tasks capture business/user intent (Constitution Principle II) as `performAs(actor)`
// sequences composed of Interactions and/or other Tasks. A Task MUST NOT encode a single
// low-level operation (that belongs in src/interactions/) and MUST NOT construct an
// Ability or a low-level client directly (src/abilities/).
export * from './OpenApplication';
export * from './AddItemToList';
