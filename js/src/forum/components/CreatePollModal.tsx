import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import PollForm from './PollForm';
import PollModel from '../models/Poll';
import PollFormState from '../states/PollFormState';

interface CreatePollModalAttrs extends IInternalModalAttrs {
  poll: PollModel;
  onsubmit: (data: object) => Promise<void>;
}

export default class CreatePollModal extends Modal<CreatePollModalAttrs> {
  title(): Mithril.Children {
    return app.translator.trans('fof-polls.forum.modal.add_title');
  }

  className(): string {
    return 'PollDiscussionModal Modal--medium';
  }

  content(): Mithril.Children {
    return [
      <div className="Modal-body">
        <PollForm poll={this.attrs.poll} onsubmit={this.onFormSubmit.bind(this)}></PollForm>
      </div>,
    ];
  }

  async onFormSubmit(data: object, state: PollFormState): Promise<void> {
    this.hide();
    await this.attrs.onsubmit(data);
  }
}
