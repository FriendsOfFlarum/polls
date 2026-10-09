import type Mithril from 'mithril';
import ItemList from 'flarum/common/utils/ItemList';
import AbstractPoll from './Poll/AbstractPoll';
export default class PollView extends AbstractPoll {
    className(): string;
    controlItems(): ItemList<Mithril.Children>;
}
