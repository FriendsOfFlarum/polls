import type Mithril from 'mithril';
import Page from 'flarum/common/components/Page';
import PollGroup from '../models/PollGroup';
import PollGroupFormState from '../states/PollGroupFormState';
import ItemList from 'flarum/common/utils/ItemList';
export default class ComposePollGroupPage extends Page {
    pollGroup: PollGroup | null | undefined;
    loading: boolean;
    oninit(vnode: Mithril.Vnode): void;
    loadEditingPollGroup(editId: string): Promise<PollGroup>;
    view(): Mithril.Children;
    onsubmit(data: Object, state: PollGroupFormState): Promise<void>;
    sidebarItems(): ItemList<Mithril.Children>;
    navItems(): ItemList<Mithril.Children>;
}
