import type Mithril from 'mithril';
import FormModal, { IFormModalAttrs } from 'flarum/common/components/FormModal';
import Stream from 'flarum/common/utils/Stream';
import Poll from '../models/Poll';
import PollFormState from '../states/PollFormState';
export interface ISchedulePollModalAttrs extends IFormModalAttrs {
    poll: Poll;
    form: {
        submit: (extra: object) => Promise<boolean>;
        state: PollFormState;
    } | null;
    onSuccess?: (poll: Poll) => void;
}
export default class SchedulePollModal<CustomAttrs extends ISchedulePollModalAttrs = ISchedulePollModalAttrs> extends FormModal<CustomAttrs> {
    datetime: Stream<string>;
    oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void;
    className(): string;
    title(): Mithril.Children;
    content(): Mithril.Children;
    onsubmit(e: SubmitEvent): Promise<void>;
}
