import Component, { ComponentAttrs } from 'flarum/common/Component';
import Mithril from 'mithril';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import PollFormState from '../../states/PollFormState';
import PollModel from '../../models/Poll';
import PollOption from '../../models/PollOption';
interface PollFormAttrs extends ComponentAttrs {
    poll: PollModel;
    onsubmit: (data: object, state: PollFormState) => Promise<void>;
    /**
     * Whether the draft / publish / schedule controls should be offered.
     * Drafts are only supported for global polls, so post-bound and
     * poll-group flows must leave this off (default). The compose page
     * opts in explicitly.
     */
    allowDrafts?: boolean;
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
    protected pendingAction: 'draft' | 'publish' | null;
    protected snapshot: string;
    private beforeUnloadHandler;
    oninit(vnode: Mithril.Vnode): void;
    oncreate(vnode: Mithril.VnodeDOM): void;
    onremove(vnode: Mithril.VnodeDOM): void;
    /**
     * Stable JSON of every user-editable field, used to detect dirty state
     * by comparison against `this.snapshot`. Order matters — keep it stable.
     */
    protected serializeFormState(): string;
    protected refreshDirty(): void;
    view(): Mithril.Children;
    fields(): ItemList<Mithril.Children>;
    submitItems(): ItemList<Mithril.Children>;
    publishSplitButton(): Mithril.Children;
    displayOptions(): ItemList<Mithril.Children>;
    addOption(): void;
    removeOption(i: number): void;
    data(): object;
    onsubmit(event: Event): Promise<void>;
    onSaveChanges(): Promise<void>;
    onSaveDraft(): Promise<void>;
    publish(): Promise<void>;
    submit(extra: object): Promise<boolean>;
    protected handleError(error: unknown): void;
    delete(): Promise<void>;
    formatDate(date?: Date | string | false | undefined | null, def?: Date | false): string | false;
    dateToTimestamp(date: Date | false): string | null;
    pollImageUploadSuccess(fileName: string | null | undefined): void;
    pollOptionImageUploadSuccess(index: number, fileName: string | null | undefined): void;
    uploadConditional(hasImage: boolean, isUpload: boolean, ifCanUpload: JSX.Element, uploadButton: JSX.Element, imageUrlInput: JSX.Element): JSX.Element;
}
export {};
