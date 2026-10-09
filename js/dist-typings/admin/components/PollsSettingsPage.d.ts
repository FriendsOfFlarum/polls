import type Mithril from 'mithril';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import ItemList from 'flarum/common/utils/ItemList';
export default class PollsSettingsPage extends ExtensionPage {
    content(): JSX.Element;
    settingsItems(): ItemList<Mithril.Children>;
    section(key: string, items: ItemList<Mithril.Children>): Mithril.Children;
    generalItems(): ItemList<Mithril.Children>;
    discussionPollsItems(): ItemList<Mithril.Children>;
    globalPollsItems(): ItemList<Mithril.Children>;
    imageItems(): ItemList<Mithril.Children>;
}
