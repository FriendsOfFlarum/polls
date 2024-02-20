import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Page from 'flarum/common/components/Page';
import Poll from '../models/Poll';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import PollForm from './PollForm';
import Acl from '../../common/Acl';
import PollFormState from '../states/PollFormState';
import ComposePollHero from './ComposePollHero';
import Button from 'flarum/common/components/Button';

export default class ComposePollPage extends Page {
  poll: Poll | null | undefined = null;

  loading: boolean = false;

  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    // If user not allowed to manage goodie collections, redirect to home
    if (!Acl.canManagePools()) {
      m.route.set(app.route('home'));
    }

    // Get the `edit` parameter from the URL
    const editId = m.route.param('id');
    if (editId) {
      this.poll = app.store.getById<Poll>('poll', editId);

      if (!this.poll) {
        this.loading = true;

        app.store.find<Poll>('fof/polls', editId).then((item) => {
          this.poll = item;
          this.loading = false;
          app.setTitle(app.translator.trans(`fof-polls.forum.compose.${!!this.poll?.id() ? 'edit' : 'add'}_title`) as string);
          m.redraw();
        });
      }
    } else {
      this.poll = PollFormState.createNewPoll();
    }

    app.history.push('compose-poll', app.translator.trans(`fof-polls.forum.compose.${!!this.poll?.id() ? 'edit' : 'add'}_title`) as string);
    this.bodyClass = 'App--compose-poll';
    app.setTitle(app.translator.trans(`fof-polls.forum.compose.${!!this.poll?.id() ? 'edit' : 'add'}_title`) as string);
  }

  view(): Mithril.Children {
    if (this.loading) {
      return <LoadingIndicator />;
    }

    return (
      <div className="ComposePollCollectionPage">
        <ComposePollHero poll={this.poll} />
        <div className="container">
          <PollForm poll={this.poll} onsubmit={this.onsubmit.bind(this)} />
        </div>
      </div>
    );
  }

  async onsubmit(data: Object, state: PollFormState) {
    const isNew = state.poll.id() === undefined;
    await state.save(data);

    const alertAttrs = isNew
      ? {
          type: 'success',
          controls: [
            <Button
              className="Button Button--link"
              onclick={() =>
                m.route.set(
                  app.route('compose-poll', {
                    edit: state.poll.id(),
                  })
                )
              }
            >
              {app.translator.trans('fof-polls.forum.compose.continue_editing')}
            </Button>,
          ],
        }
      : {
          type: 'success',
        };

    // Show success alert
    const alertId = app.alerts.show(alertAttrs, app.translator.trans('fof-polls.forum.compose.success'));

    // Hide alert after 10 seconds
    setTimeout(() => app.alerts.dismiss(alertId), 10000);

    if (isNew) {
      m.route.set(app.route('fof_polls_list'));
    }
  }
}
