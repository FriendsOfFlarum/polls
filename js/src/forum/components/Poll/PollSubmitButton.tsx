import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import PollState from '../../states/PollState';

export interface IPollSubmitButtonAttrs extends ComponentAttrs {
  state: PollState;
}

export default class PollSubmitButton<CustomAttrs extends IPollSubmitButtonAttrs = IPollSubmitButtonAttrs> extends Component<CustomAttrs> {
  view(): Mithril.Children {
    const state = this.attrs.state;

    return (
      <Button
        type="button"
        className="Button Button--primary Poll-submit"
        loading={state.loadingOptions}
        disabled={!state.hasSelectedOptions()}
        onclick={() => state.onsubmit()}
      >
        {app.translator.trans('fof-polls.forum.poll.submit_button')}
      </Button>
    );
  }
}
