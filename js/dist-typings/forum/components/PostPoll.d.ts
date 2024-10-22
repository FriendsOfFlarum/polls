import Component, { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import Poll from '../models/Poll';
import type Mithril from 'mithril';
import PollOption from '../models/PollOption';
import Post from 'flarum/common/models/Post';
export interface PostPollAttrs extends ComponentAttrs {
    poll: Poll;
    post?: Post;
}
export default class PostPoll extends Component<PostPollAttrs> {
    loadingOptions: boolean;
    useSubmitUI: boolean;
    pendingSubmit: boolean;
    pendingOptions: any;
    oninit(vnode: Mithril.Vnode<PostPollAttrs, this>): void;
    oncreate(vnode: Mithril.Vnode<PostPollAttrs, this>): void;
    onremove(vnode: Mithril.Vnode<PostPollAttrs, this>): void;
    view(): JSX.Element;
    infoItems(maxVotes: number): ItemList<unknown>;
    viewOption(opt: PollOption): JSX.Element;
    changeVote(option: PollOption, evt: Event): Promise<void> | undefined;
    onsubmit(): Promise<void>;
    submit(optionIds: any, cb: any, onerror: any): Promise<void>;
    showVoters(): void;
    deletePoll(): void;
    /**
     * Attempting to use the `tooltipVisible` attr on the Tooltip component set to 'false' when no vote count
     * caused the tooltip to break on click. This is a workaround to hide the tooltip when no vote count is available,
     * called on 'onremove' of the Tooltip component. It doesn't always work as intended either, but it does the job.
     */
    hideOptionTooltip(vnode: Mithril.Vnode<PostPollAttrs, this>): void;
    /**
     * Alert before navigating away using browser's 'beforeunload' event
     */
    preventClose(e: any): true | undefined;
}
