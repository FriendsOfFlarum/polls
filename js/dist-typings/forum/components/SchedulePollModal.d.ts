import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import Stream from 'flarum/common/utils/Stream';
import Poll from '../models/Poll';
import PollFormState from '../states/PollFormState';
import type Mithril from 'mithril';
interface SchedulePollModalAttrs extends IInternalModalAttrs {
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
export default class SchedulePollModal extends Modal<SchedulePollModalAttrs> {
    datetime: Stream<string>;
    error: string | null;
    oninit(vnode: Mithril.Vnode): void;
    className(): string;
    title(): Mithril.Children;
    content(): Mithril.Children;
    onSchedule(): Promise<void>;
}
export {};
