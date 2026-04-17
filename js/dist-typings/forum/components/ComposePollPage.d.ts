import type Mithril from 'mithril';
import Page from 'flarum/common/components/Page';
import ItemList from 'flarum/common/utils/ItemList';
import Poll from '../models/Poll';
import PollFormState from '../states/PollFormState';
export default class ComposePollPage extends Page {
    poll: Poll | null | undefined;
    loading: boolean;
    oninit(vnode: Mithril.Vnode): void;
    loadEditingPoll(editId: string): Promise<Poll>;
    view(): Mithril.Children;
    hero(): Mithril.Children;
    sidebar(): Mithril.Children;
    contentItems(): ItemList<Mithril.Children>;
    onsubmit(data: Object, state: PollFormState): Promise<void>;
}
