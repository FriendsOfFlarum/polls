import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollOption from './PollOption';
import PollOptionModel from '../../models/PollOption';
import ItemList from 'flarum/common/utils/ItemList';
import PollState from '../../states/PollState';

interface PollOptionsAttrs extends ComponentAttrs {
  options: PollOptionModel[];
  name: String;
  state: PollState;
}

export default class PollOptions extends Component<PollOptionsAttrs> {
  view(): Mithril.Children {
    return <div className="Poll-options list-layout">{this.pollOptions().toArray()}</div>;
  }

  pollOptions(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    this.attrs.options.forEach((option: PollOptionModel): void => {
      items.add('option' + option.id(), this.createOptionView(option));
    });

    return items;
  }

  createOptionView(option: PollOptionModel): Mithril.Children {
    return <PollOption name={this.attrs.name} option={option} state={this.attrs.state} />;
  }
}
