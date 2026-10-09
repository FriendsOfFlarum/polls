import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Form from 'flarum/common/components/Form';
import FormGroup from 'flarum/common/components/FormGroup';
import ItemList from 'flarum/common/utils/ItemList';
import RequestError from 'flarum/common/utils/RequestError';
import Stream from 'flarum/common/utils/Stream';
import FormError from '../form/FormError';
import PollGroupModel from '../../models/PollGroup';
import PollGroupFormState from '../../states/PollGroupFormState';
import PollGroupControls from '../../utils/PollGroupControls';
import PollListItem from '../Poll/PollListItem';

export interface IPollGroupFormAttrs extends ComponentAttrs {
  pollGroup: PollGroupModel;
  onsubmit: (data: object, state: PollGroupFormState) => Promise<void>;
}

export default class PollGroupForm extends Component<IPollGroupFormAttrs, PollGroupFormState> {
  protected name!: Stream<string>;

  oninit(vnode: Mithril.Vnode<IPollGroupFormAttrs, this>): void {
    super.oninit(vnode);

    this.state = new PollGroupFormState(this.attrs.pollGroup);
    this.name = Stream(this.state.pollGroup.name() || '');
  }

  view(): Mithril.Children {
    return (
      <form className="PollGroupForm" onsubmit={this.onsubmit.bind(this)}>
        <Form>{this.fields().toArray()}</Form>
      </form>
    );
  }

  fields(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'name',
      <FormGroup
        type="text"
        name="name"
        label={app.translator.trans('fof-polls.forum.poll_groups.composer.name_label')}
        required={true}
        stream={this.name}
      />,
      100
    );

    items.add('submit', <div className="PollGroupForm-submit">{this.submitItems().toArray()}</div>, 50);

    if (this.state.pollGroup.exists) {
      const polls = this.pollItems().toArray();

      if (polls.length) {
        items.add('polls', <ul className="PollGroupForm-polls">{polls}</ul>, 20);
      }

      items.add(
        'addPoll',
        <Button
          className="Button Button--primary PollGroupForm-addPoll"
          icon="fas fa-plus"
          onclick={() => PollGroupControls.addPoll(this.state.pollGroup)}
        >
          {app.translator.trans('fof-polls.forum.poll_groups.controls.add_poll_label')}
        </Button>,
        10
      );
    }

    return items;
  }

  submitItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'save',
      <Button type="submit" className="Button Button--primary" icon="fas fa-save" loading={this.state.loading}>
        {app.translator.trans('fof-polls.forum.poll_groups.composer.save_changes')}
      </Button>,
      100
    );

    if (this.state.pollGroup.exists) {
      items.add(
        'delete',
        <Button
          type="button"
          className="Button Button--secondary"
          icon="fas fa-trash-alt"
          loading={this.state.deleting}
          onclick={() => this.state.delete()}
        >
          {app.translator.trans('fof-polls.forum.poll_groups.composer.delete')}
        </Button>,
        0
      );
    }

    return items;
  }

  pollItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    this.state.pollGroup.polls()?.forEach((poll) => {
      if (!poll) return;

      items.add(
        `poll-${poll.id()}`,
        <li key={poll.id()} className="PollGroupForm-poll">
          <PollListItem poll={poll} />
        </li>
      );
    });

    return items;
  }

  data(): object {
    if (!this.name()) {
      throw new FormError(app.translator.trans('fof-polls.forum.poll_groups.composer.name_required'));
    }

    return { name: this.name() };
  }

  async onsubmit(event: Event): Promise<void> {
    event.preventDefault();

    try {
      await this.attrs.onsubmit(this.data(), this.state);
    } catch (error) {
      if (error instanceof FormError) {
        app.alerts.show({ type: 'error' }, error.content);
        return;
      }

      // Core's request handler has already shown the server's own message.
      if (error instanceof RequestError) return;

      console.error(error);
      app.alerts.show({ type: 'error' }, app.translator.trans('fof-polls.forum.poll_groups.composer.error'));
    }
  }
}
