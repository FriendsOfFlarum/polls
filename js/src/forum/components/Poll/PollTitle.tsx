import Component, { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import Poll from 'src/forum/models/Poll';
import Mithril from 'mithril';

export interface PollTitleAttrs extends ComponentAttrs {
  poll: Poll;
}

export default class PollTitle extends Component<PollTitleAttrs> {
  view() {
    return <div className="Poll-title-component">{this.pollTitleItems().toArray()}</div>;
  }

  pollTitleItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('title', <h3 className="Poll-title">{this.attrs.poll.question()}</h3>);

    return items;
  }
}
