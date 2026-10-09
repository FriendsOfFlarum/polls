import type Mithril from 'mithril';
import extractText from 'flarum/common/utils/extractText';

export default class FormError extends Error {
  content: Mithril.Children;

  constructor(content: Mithril.Children) {
    super(extractText(content));

    this.content = content;
  }
}
