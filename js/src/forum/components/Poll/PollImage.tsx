import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';

export interface PollImageAttrs extends ComponentAttrs {
  imageUrl: string;
}

export default class PollImage extends Component<PollImageAttrs> {
  view(): Mithril.Children {
    const imageUrl = this.attrs.imageUrl;

    return <img src={imageUrl} alt="" />;
  }
}
