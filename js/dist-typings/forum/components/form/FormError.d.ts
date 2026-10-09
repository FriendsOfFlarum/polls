import type Mithril from 'mithril';
export default class FormError extends Error {
    content: Mithril.Children;
    constructor(content: Mithril.Children);
}
