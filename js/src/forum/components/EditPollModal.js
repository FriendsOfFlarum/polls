import app from 'flarum/forum/app';
import CreatePollModal from './CreatePollModal';

export default class EditPollModal extends CreatePollModal {
  title() {
    return app.translator.trans('fof-polls.forum.modal.edit_title');
  }
}
