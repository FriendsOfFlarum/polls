import type Mithril from 'mithril';
import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import PollModel from '../models/Poll';
import PollFormState from '../states/PollFormState';
interface CreatePollModalAttrs extends IInternalModalAttrs {
    poll: PollModel;
    onsubmit: (data: object) => Promise<void>;
}
export default class CreatePollModal extends Modal<CreatePollModalAttrs> {
    title(): Mithril.Children;
    className(): string;
    content(): Mithril.Children;
    onFormSubmit(data: object, state: PollFormState): Promise<void>;
}
export {};
