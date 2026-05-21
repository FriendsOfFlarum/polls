import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import CreatePollModal from './CreatePollModal';
import PollFormState from '../states/PollFormState';

export default class EditPollModal extends CreatePollModal {
  title(): Mithril.Children {
    return app.translator.trans('fof-polls.forum.modal.edit_title');
  }

  async onFormSubmit(data: object, state: PollFormState): Promise<void> {
    await state.save(data);
    this.hide();
    // Success alert is fired by PollForm.onsubmit (the form-level
    // handler) now, matching the per-flow pattern in ComposePollPage.
  }
}
