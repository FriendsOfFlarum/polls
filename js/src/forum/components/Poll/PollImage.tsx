import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Poll from 'src/forum/models/Poll';
import ItemList from 'flarum/common/utils/ItemList';

interface PollImageAttrs extends ComponentAttrs {
  poll: Poll;
}

export default class PollImage extends Component<PollImageAttrs> {
  imageUrl: string | null = null;
  imageAlt: string | null = null;

  oninit(vnode: Mithril.Vnode<PollImageAttrs, this>) {
    super.oninit(vnode);

    this.imageUrl = this.attrs.poll.imageUrl();
    this.imageAlt = this.attrs.poll.imageAlt();
  }

  view(): Mithril.Children {
    if (!this.imageUrl) {
      return;
    }

    return <div className="PollImage">{this.imageItems().toArray()}</div>;
  }

  imageItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('image', <img src={this.imageUrl} alt={this.imageAlt ?? ''} className="PollImage-image" loading="lazy" />);

    return items;
  }
}
