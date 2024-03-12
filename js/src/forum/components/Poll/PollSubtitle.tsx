import Component, { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import Poll from 'src/forum/models/Poll';
import Mithril from 'mithril';

export interface PollSubtitleAttrs extends ComponentAttrs {
  poll: Poll;
}

export default class PollSubtitle extends Component<PollSubtitleAttrs> {
  view() {
    if (!this.attrs.poll.subtitle()) {
      return;
    }

    return <div className="Poll-subtitle-component">{this.pollSubtitleItems().toArray()}</div>;
  }

  pollSubtitleItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('subtitle', <p className="Poll-subtitle">{this.attrs.poll.subtitle()}</p>);

    return items;
  }
}
