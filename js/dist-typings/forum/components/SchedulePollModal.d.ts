import FormModal, { IFormModalAttrs } from 'flarum/common/components/FormModal';
import Stream from 'flarum/common/utils/Stream';
import Poll from '../models/Poll';
import PollFormState from '../states/PollFormState';
import type Mithril from 'mithril';
interface SchedulePollModalAttrs extends IFormModalAttrs {
    poll: Poll;
    /**
     * Parent PollForm to persist-before-schedule. Pass `null` when opening
     * the modal for an already-saved poll (e.g. from the controls menu),
     * in which case we skip straight to scheduling.
     */
    form: {
        submit: (extra: object) => Promise<boolean>;
        state: PollFormState;
    } | null;
    onSuccess?: (poll: Poll) => void;
}
export default class SchedulePollModal extends FormModal<SchedulePollModalAttrs> {
    datetime: Stream<string>;
    error: string | null;
    oninit(vnode: Mithril.Vnode<SchedulePollModalAttrs, this>): void;
    className(): string;
    title(): Mithril.Children;
    content(): Mithril.Children;
    onsubmit(e: SubmitEvent): Promise<void>;
}
export {};
