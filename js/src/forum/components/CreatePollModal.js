import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import PollForm from './PollForm';

export default class CreatePollModal extends Modal {
  title() {
    return app.translator.trans('fof-polls.forum.modal.add_title');
  }

  className() {
    return 'PollDiscussionModal Modal--medium';
  }

  content() {
    //@todo check if bind is needed for onsubmit
    return [
      <div className="Modal-body">
        <PollForm modal={this} poll={this.attrs.poll} onsubmit={this.onsubmit.bind(this)}></PollForm>
      </div>,
    ];
  }

  onsubmit(poll) {
    this.hide();
    this.attrs.onsubmit(poll);
  }
}
