import type Mithril from 'mithril';
import FormModal, { IFormModalAttrs } from 'flarum/common/components/FormModal';
import PollModel from '../models/Poll';
import PollFormState from '../states/PollFormState';
interface CreatePollModalAttrs extends IFormModalAttrs {
    poll: PollModel;
    onsubmit: (data: object) => Promise<void>;
}
export default class CreatePollModal extends FormModal<CreatePollModalAttrs> {
    title(): Mithril.Children;
    className(): string;
    content(): Mithril.Children;
    onFormSubmit(data: object, state: PollFormState): Promise<void>;
}
export {};
