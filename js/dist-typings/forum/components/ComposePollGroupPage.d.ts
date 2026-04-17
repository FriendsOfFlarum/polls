import type Mithril from 'mithril';
import Page from 'flarum/common/components/Page';
import ItemList from 'flarum/common/utils/ItemList';
import PollGroup from '../models/PollGroup';
import PollGroupFormState from '../states/PollGroupFormState';
export default class ComposePollGroupPage extends Page {
    pollGroup: PollGroup | null | undefined;
    loading: boolean;
    oninit(vnode: Mithril.Vnode): void;
    loadEditingPollGroup(editId: string): Promise<PollGroup>;
    view(): Mithril.Children;
    hero(): Mithril.Children;
    sidebar(): Mithril.Children;
    contentItems(): ItemList<Mithril.Children>;
    onsubmit(data: Object, state: PollGroupFormState): Promise<void>;
}
