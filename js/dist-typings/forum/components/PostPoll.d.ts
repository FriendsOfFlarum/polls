import type Mithril from 'mithril';
import Post from 'flarum/common/models/Post';
import ItemList from 'flarum/common/utils/ItemList';
import AbstractPoll, { IPollAttrs } from './Poll/AbstractPoll';
import PollState from '../states/PollState';
export interface IPostPollAttrs extends IPollAttrs {
    post?: Post;
}
export default class PostPoll extends AbstractPoll<IPostPollAttrs> {
    className(): string;
    createState(): PollState;
    controlItems(): ItemList<Mithril.Children>;
    deletePoll(): void;
}
