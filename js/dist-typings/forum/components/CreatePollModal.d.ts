import type Mithril from 'mithril';
import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import PollModel from '../models/Poll';
import PollFormState from '../states/PollFormState';
export interface ICreatePollModalAttrs extends IInternalModalAttrs {
    poll: PollModel;
    onsubmit: (data: object) => Promise<void> | void;
}
export default class CreatePollModal<CustomAttrs extends ICreatePollModalAttrs = ICreatePollModalAttrs> extends Modal<CustomAttrs> {
    title(): Mithril.Children;
    className(): string;
    content(): Mithril.Children;
    onFormSubmit(data: object, state: PollFormState): Promise<void>;
}
