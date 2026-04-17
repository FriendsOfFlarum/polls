import Component, { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import Poll from '../models/Poll';
import type Mithril from 'mithril';
import Post from 'flarum/common/models/Post';
import PollState from '../states/PollState';
export interface PostPollAttrs extends ComponentAttrs {
    poll: Poll;
    post?: Post;
}
export default class PostPoll extends Component<PostPollAttrs, PollState> {
    state: PollState;
    oninit(vnode: Mithril.Vnode<PostPollAttrs, this>): void;
    oncreate(vnode: Mithril.Vnode<PostPollAttrs, this>): void;
    onremove(vnode: Mithril.Vnode<PostPollAttrs, this>): void;
    view(): JSX.Element;
    actionItems(): ItemList<Mithril.Children>;
    infoItems(maxVotes: number): ItemList<Mithril.Children>;
    deletePoll(): void;
    preventClose(e: Event): true | undefined;
}
