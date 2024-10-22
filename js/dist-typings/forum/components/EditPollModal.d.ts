import type Mithril from 'mithril';
import CreatePollModal from './CreatePollModal';
import PollFormState from '../states/PollFormState';
export default class EditPollModal extends CreatePollModal {
    title(): Mithril.Children;
    onFormSubmit(data: object, state: PollFormState): Promise<void>;
}
