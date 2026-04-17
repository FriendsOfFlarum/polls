import type Mithril from 'mithril';

export default class FormError extends Error {
  constructor(message: Mithril.Children | string) {
    super(String(message));
  }
}
