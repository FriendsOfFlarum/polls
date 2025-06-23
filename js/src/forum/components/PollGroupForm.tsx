import Component, { ComponentAttrs } from 'flarum/common/Component';
import Mithril from 'mithril';
import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import FormError from './form/FormError';
import PollGroupModel from '../models/PollGroup';
import PollGroupFormState from '../states/PollGroupFormState';

interface PollGroupFormAttrs extends ComponentAttrs {
  pollGroup: PollGroupModel;
  onsubmit: (data: object, state: PollGroupFormState) => Promise<void>;
}

export default class PollGroupForm extends Component<PollGroupFormAttrs, PollGroupFormState> {
  protected name: Stream<string>;

  oninit(vnode: Mithril.Vnode): void {
    super.oninit(vnode);

    this.state = new PollGroupFormState(this.attrs.pollGroup);
    this.name = Stream(this.state.pollGroup.name() || '');
  }

  view(): Mithril.Children {
    return (
      <form onsubmit={this.onsubmit.bind(this)}>
        <div className="PollGroupModal-form">
          {this.fields().toArray()}
        </div>
      </form>
    );
  }

  fields(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'name',
      <div className="Form-group">
        <label className="label">Name</label>
        <input type="text" name="name" className="FormControl" bidi={this.name} required />
      </div>,
      100
    );

    items.add(
      'submit',
      <div className="Form-group">
        <Button
          type="submit"
          className="Button Button--primary PollGroupModal-SubmitButton"
          icon="fas fa-save"
          loading={this.state.loading}
        >
          {app.translator.trans('fof-polls.forum.poll_groups.composer.save_changes')}
        </Button>
        {this.state.pollGroup.exists && (
          <Button
            className="Button Button--secondary PollGroupModal-deleteButton"
            icon="fas fa-trash-alt"
            loading={this.state.deleting}
            onclick={this.delete.bind(this)}
          >
            {app.translator.trans('fof-polls.forum.poll_groups.composer.delete')}
          </Button>
        )}
      </div>,
      -10
    );

    return items;
  }

  data(): object {
    if (!this.name()) {
      throw new FormError('Name cannot be empty');
    }

    return {
      name: this.name(),
    };
  }

  async onsubmit(event: Event) {
    event.preventDefault();

    try {
      await this.attrs.onsubmit(this.data(), this.state);
    } catch (error) {
      if (error instanceof FormError) {
        app.alerts.show({ type: 'error' }, error.message);
      } else {
        console.error(error);
        app.alerts.show({ type: 'error' }, 'An error occurred while saving the poll group');
      }
    }
  }

  async delete(): Promise<void> {
    await this.state.delete();
  }
}