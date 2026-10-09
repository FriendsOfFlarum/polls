import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import AbstractPoll from './Poll/AbstractPoll';
import PollControls from '../utils/PollControls';

export default class PollView extends AbstractPoll {
  className(): string {
    return 'Poll';
  }

  controlItems(): ItemList<Mithril.Children> {
    const poll = this.attrs.poll;
    const items = PollControls.controls(poll, this);

    if (poll.publicPoll() || poll.canEdit()) {
      items.add(
        'voters',
        <Button onclick={this.state.showVoters} icon="fas fa-poll">
          {app.translator.trans('fof-polls.forum.public_poll')}
        </Button>,
        100
      );
    }

    return items;
  }
}
