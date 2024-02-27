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

    // Show success alert
    const alertId = app.alerts.show(
      {
        type: 'success',
      },
      app.translator.trans('fof-polls.forum.compose.success')
    );

    // Hide alert after 10 seconds
    setTimeout(() => app.alerts.dismiss(alertId), 10000);
  }
}
