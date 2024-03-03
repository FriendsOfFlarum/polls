import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollOption from './PollOption';
import PollOptionModel from '../../models/PollOption';
import PollResult from './PollResult';
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
    const state = this.attrs.state;

    if (state.isShowResults() || state.isCompactView) {
      this.attrs.options.forEach((option: PollOptionModel): void => {
        items.add('result' + option.id(), <PollResult name={this.attrs.name} option={option} state={state} />);
      });
    } else {
      this.attrs.options.forEach((option: PollOptionModel): void => {
        items.add('option' + option.id(), <PollOption name={this.attrs.name} option={option} state={state} />);
      });
    }

    return items;
  }
}
