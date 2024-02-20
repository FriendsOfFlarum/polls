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
    return [
      <div className="Modal-body">
        <PollForm poll={this.attrs.poll} onsubmit={this.onsubmit.bind(this)}></PollForm>
      </div>,
    ];
  }

  onsubmit(data) {
    this.hide();
    this.attrs.onsubmit(data);
  }
}
