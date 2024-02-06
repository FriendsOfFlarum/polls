import * as Mithril from 'mithril';
import Component from 'flarum/common/Component';
import PollOptionLabel from './PollOptionLabel';
import PollOptionInput from './PollOptionInput';

export default class PollOption extends Component {
  view(): Mithril.Children {
    const option = this.attrs.option;
    return (
      <label className="PollOption-tmp">
        <PollOptionInput id={option.id()} isResult={false} name="vote" value="Vote for this option" />
        <span className="PollOption-information">
          <PollOptionLabel id={option.id()} text={option.answer()} />
        </span>
      </label>
    );
  }
}
