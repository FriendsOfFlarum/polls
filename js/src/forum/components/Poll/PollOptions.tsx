import Mithril from 'mithril';
import Component from 'flarum/common/Component';
import PollOption from './PollOption';
import PollOptionModel from '../../models/PollOption';
import PollResult from './PollResult';
import ItemList from 'flarum/common/utils/ItemList';

export default class PollOptions extends Component {
  view(): Mithril.Children {
    return <div className="Poll-options list-layout">{this.pollOptions().toArray()}</div>;
  }

  pollOptions(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    this.attrs.options.forEach((option:PollOptionModel):void => {
        items.add('option' + option.id(), <PollOption option={option} />);
    });

    items.add('test5', <PollResult />);

    return items;
  }
}
