import type Mithril from 'mithril';
import Page from 'flarum/common/components/Page';
import Poll from '../models/Poll';
import PollFormState from '../states/PollFormState';
import ItemList from 'flarum/common/utils/ItemList';
export default class ComposePollPage extends Page {
    poll: Poll | null | undefined;
    loading: boolean;
    oninit(vnode: Mithril.Vnode): void;
    loadEditingPoll(editId: string): Promise<Poll>;
    view(): Mithril.Children;
    onsubmit(data: Object, state: PollFormState): Promise<void>;
    sidebarItems(): ItemList<Mithril.Children>;
    navItems(): ItemList<Mithril.Children>;
}
