import type Mithril from 'mithril';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import ItemList from 'flarum/common/utils/ItemList';
export default class PollsIndexSidebar extends IndexSidebar {
    items(): ItemList<Mithril.Children>;
    newPollAction(): void;
}
