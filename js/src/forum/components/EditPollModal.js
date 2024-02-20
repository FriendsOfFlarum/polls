import app from 'flarum/forum/app';
import CreatePollModal from './CreatePollModal';

export default class EditPollModal extends CreatePollModal {
  title() {
    return app.translator.trans('fof-polls.forum.modal.edit_title');
  }

  async onsubmit(data, state) {
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
