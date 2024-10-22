import Component, { ComponentAttrs } from 'flarum/common/Component';
import Mithril from 'mithril';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import PollFormState from '../states/PollFormState';
import PollModel from '../models/Poll';
import PollOption from '../models/PollOption';
interface PollFormAttrs extends ComponentAttrs {
    poll: PollModel;
    onsubmit: (data: object, state: PollFormState) => Promise<void>;
}
export default class PollForm extends Component<PollFormAttrs, PollFormState> {
    protected options: PollOption[];
    protected optionAnswers: Stream<string>[];
    protected optionImageUrls: Stream<string>[];
    protected question: Stream<string>;
    protected subtitle: Stream<string>;
    protected image: Stream<string | null>;
    protected imageAlt: Stream<string | null>;
    protected endDate: Stream<string | null>;
    protected publicPoll: Stream<boolean>;
    protected allowMultipleVotes: Stream<boolean>;
    protected hideVotes: Stream<boolean>;
    protected allowChangeVote: Stream<boolean>;
    protected maxVotes: Stream<number>;
    protected datepickerMinDate: string;
    oninit(vnode: Mithril.Vnode): void;
    view(): Mithril.Children;
    fields(): ItemList<Mithril.Children>;
    displayOptions(): ItemList<Mithril.Children>;
    addOption(): void;
    removeOption(i: number): void;
    data(): object;
    onsubmit(event: Event): Promise<void>;
    delete(): Promise<void>;
    formatDate(date?: Date | string | false | undefined | null, def?: Date | false): string | false;
    dateToTimestamp(date: Date | false): string | null;
    pollImageUploadSuccess(fileName: string | null | undefined): void;
    pollOptionImageUploadSuccess(index: number, fileName: string | null | undefined): void;
    uploadConditional(hasImage: boolean, isUpload: boolean, ifCanUpload: JSX.Element, uploadButton: JSX.Element, imageUrlInput: JSX.Element): JSX.Element;
}
export {};
