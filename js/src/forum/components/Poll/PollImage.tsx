import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';

interface PollImageAttrs extends ComponentAttrs {
  imageUrl: string;
  alt: string;
}

export default class PollImage extends Component<PollImageAttrs> {
  view(): Mithril.Children {
    return (
      <div className="PollImage">
        <img src={this.attrs.imageUrl} alt={this.attrs.alt} className="PollImage-image" />
      </div>
    );
  }
}
