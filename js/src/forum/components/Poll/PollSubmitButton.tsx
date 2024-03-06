import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import PollState from '../../states/PollState';

interface PollSubmitButtonAttrs extends ComponentAttrs {
  state: PollState;
}

export default class PollSubmitButton extends Component<PollSubmitButtonAttrs> {
  view(): Mithril.Children {
    const state = this.attrs.state;
    return (
      <Button
        className="Button Button--primary Poll-submit"
        loading={state.loadingOptions}
        onclick={(event:Event) => this.pollButtonSubmit(state, event)}
        disabled={!state.hasSelectedOptions()}
      >
        {app.translator.trans('fof-polls.forum.poll.submit_button')}
      </Button>
    );
  }

  /**
   * Event handler for submit button being clicked
   */

  pollButtonSubmit(state: PollState, event:Event): void {
    state.onsubmit();
  }
}
