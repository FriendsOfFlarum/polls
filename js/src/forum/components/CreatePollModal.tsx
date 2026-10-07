import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import PollForm from './Poll/PollForm';
import PollModel from '../models/Poll';
import PollFormState from '../states/PollFormState';

export interface ICreatePollModalAttrs extends IInternalModalAttrs {
  poll: PollModel;
  onsubmit: (data: object) => Promise<void> | void;
}

// Plain Modal, not FormModal: PollForm brings its own <form>.
export default class CreatePollModal<CustomAttrs extends ICreatePollModalAttrs = ICreatePollModalAttrs> extends Modal<CustomAttrs> {
  title(): Mithril.Children {
    return app.translator.trans('fof-polls.forum.modal.add_title');
  }

  className(): string {
    return 'PollDiscussionModal Modal--medium';
  }

  content(): Mithril.Children {
    return (
      <div className="Modal-body">
        <PollForm poll={this.attrs.poll} onsubmit={this.onFormSubmit.bind(this)} />
      </div>
    );
  }

  async onFormSubmit(data: object, state: PollFormState): Promise<void> {
    await this.attrs.onsubmit(data);

    this.hide();
  }
}
