import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Poll from '../../models/Poll';

export interface IPollImageAttrs extends ComponentAttrs {
  poll: Poll;
}

export default class PollImage<CustomAttrs extends IPollImageAttrs = IPollImageAttrs> extends Component<CustomAttrs> {
  view(): Mithril.Children {
    const poll = this.attrs.poll;
    const url = poll.imageUrl();

    if (!url) return null;

    return (
      <div className="PollImage">
        <img className="PollImage-image" src={url} srcset={poll.imageSrcset() ?? undefined} alt={poll.imageAlt() ?? ''} loading="lazy" />
      </div>
    );
  }
}
