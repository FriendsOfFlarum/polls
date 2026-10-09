import type Mithril from 'mithril';
import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import PollModel from '../models/Poll';
import PollOption from '../models/PollOption';
import PollVote from '../models/PollVote';
export interface IListVotersModalAttrs extends IInternalModalAttrs {
    poll: PollModel;
}
export default class ListVotersModal<CustomAttrs extends IListVotersModalAttrs = IListVotersModalAttrs> extends Modal<CustomAttrs> {
    oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void;
    className(): string;
    title(): Mithril.Children;
    content(): Mithril.Children;
    optionContent(option: PollOption): Mithril.Children;
    voteContent(vote: PollVote): Mithril.Children;
}
