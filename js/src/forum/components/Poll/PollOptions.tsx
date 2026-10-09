import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import PollOption from './PollOption';
import PollOptionModel from '../../models/PollOption';
import PollState from '../../states/PollState';

export interface IPollOptionsAttrs extends ComponentAttrs {
  options: PollOptionModel[];
  name: string;
  state: PollState;
}

export default class PollOptions<CustomAttrs extends IPollOptionsAttrs = IPollOptionsAttrs> extends Component<CustomAttrs> {
  view(): Mithril.Children {
    return <div className="Poll-options">{this.pollOptions().toArray()}</div>;
  }

  pollOptions(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    this.attrs.options.forEach((option) => {
      items.add(`option${option.id()}`, this.createOptionView(option));
    });

    return items;
  }

  createOptionView(option: PollOptionModel): Mithril.Children {
    return <PollOption key={option.id()} name={this.attrs.name} option={option} state={this.attrs.state} />;
  }
}
