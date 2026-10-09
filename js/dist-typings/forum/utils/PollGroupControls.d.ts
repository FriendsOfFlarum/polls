import type Mithril from 'mithril';
import Component from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import PollGroup from '../models/PollGroup';
type Context = Component<any, any>;
declare const _default: {
    controls(pollGroup: PollGroup, context: Context): ItemList<Mithril.Children>;
    moderationControls(pollGroup: PollGroup, context: Context): ItemList<Mithril.Children>;
    destructiveControls(pollGroup: PollGroup, context: Context): ItemList<Mithril.Children>;
    editAction(pollGroup: PollGroup): void;
    deleteAction(pollGroup: PollGroup): Promise<void>;
    addPoll(pollGroup: PollGroup): void;
    alert(type: 'success' | 'error', key: string): void;
};
export default _default;
