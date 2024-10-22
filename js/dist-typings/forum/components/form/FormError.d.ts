import { NestedStringArray } from '@askvortsov/rich-icu-message-formatter';
export default class FormError extends Error {
    constructor(props: NestedStringArray | string);
}
