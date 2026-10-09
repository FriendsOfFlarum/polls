import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import Post from 'flarum/common/models/Post';
import ItemList from 'flarum/common/utils/ItemList';
import extractText from 'flarum/common/utils/extractText';
import AbstractPoll, { IPollAttrs } from './Poll/AbstractPoll';
import PollState from '../states/PollState';

export interface IPostPollAttrs extends IPollAttrs {
  post?: Post;
}

export default class PostPoll extends AbstractPoll<IPostPollAttrs> {
  className(): string {
    return 'Post-poll';
  }

  createState(): PollState {
    return new PollState(this.attrs.poll, this.attrs.post);
  }

  controlItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const poll = this.attrs.poll;

    if (poll.canSeeVoters()) {
      items.add(
        'voters',
        <Button onclick={this.state.showVoters} icon="fas fa-poll">
          {app.translator.trans('fof-polls.forum.public_poll')}
        </Button>,
        100
      );
    }

    if (poll.canEdit()) {
      items.add(
        'edit',
        <Button onclick={() => app.modal.show(() => import('./EditPollModal'), { poll })} icon="fas fa-pen">
          {app.translator.trans('fof-polls.forum.moderation.edit')}
        </Button>,
        50
      );
    }

    if (poll.canDelete()) {
      items.add(
        'delete',
        <Button onclick={this.deletePoll.bind(this)} icon="fas fa-trash">
          {app.translator.trans('fof-polls.forum.moderation.delete')}
        </Button>,
        0
      );
    }

    return items;
  }

  deletePoll(): void {
    if (!confirm(extractText(app.translator.trans('fof-polls.forum.moderation.delete_confirm')))) return;

    this.attrs.poll.delete().then(() => m.redraw.sync());
  }
}
