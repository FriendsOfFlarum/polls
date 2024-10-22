import type Mithril from 'mithril';
import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import PollModel from '../models/Poll';
import PollVote from '../models/PollVote';
import PollOption from '../models/PollOption';
interface ListVotersModalAttrs extends IInternalModalAttrs {
    poll: PollModel;
    onsubmit: (data: object) => Promise<void>;
}
export default class ListVotersModal extends Modal<ListVotersModalAttrs> {
    oninit(vnode: Mithril.Vnode): void;
    className(): string;
    title(): Mithril.Children;
    content(): Mithril.Children;
    optionContent(opt: PollOption): Mithril.Children;
    optionAnswer(opt: PollOption): string;
    voteContent(vote: PollVote): Mithril.Children;
}
export {};
