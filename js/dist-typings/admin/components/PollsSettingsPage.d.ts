import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import ItemList from 'flarum/common/utils/ItemList';
import Mithril from 'mithril';
export default class PollsSettingsPage extends ExtensionPage {
    content(): JSX.Element;
    settingsItems(): ItemList<Mithril.Children>;
    generalItems(): ItemList<Mithril.Children>;
    globalPollsItems(): ItemList<Mithril.Children>;
    imageItems(): ItemList<Mithril.Children>;
}
