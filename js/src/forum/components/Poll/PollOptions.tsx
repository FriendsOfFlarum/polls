import * as Mithril from 'mithril';
import Component from 'flarum/common/Component';
import PollOption from './PollOption';
import listItems from 'flarum/common/helpers/listItems';
import ItemList from 'flarum/common/utils/ItemList';

export default class PollOptions extends Component {
  view(): Mithril.Children {
    return <div className="Poll-options grid-layout">{this.pollOptions().toArray()}</div>;
  }

  pollOptions(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('test1', <PollOption />);
    items.add('test2', <PollOption />);
    items.add('test3', <PollOption />);
    items.add('test4', <PollOption />);
    items.add('test5', <PollOption />);

    return items;
  }
}
