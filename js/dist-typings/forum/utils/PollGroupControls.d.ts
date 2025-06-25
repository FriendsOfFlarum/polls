import type Mithril from 'mithril';
import PollGroup from '../models/PollGroup';
import Component from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
/**
 * The `PollGroupControls` utility constructs a list of buttons for a poll group which
 * perform actions on it.
 */
declare const _default: {
    /**
     * Get a list of controls for a poll group.
     */
    controls(pollGroup: PollGroup, context: Component): ItemList<Mithril.Children>;
    /**
     * Get controls for a poll group pertaining to moderation (e.g. edit).
     */
    moderationControls(pollGroup: PollGroup, context: Component): ItemList<Mithril.Children>;
    /**
     * Get controls for a poll group which are destructive (e.g. delete).
     * @protected
     */
    destructiveControls(pollGroup: PollGroup, context: Component): ItemList<Mithril.Children>;
    /**
     * Delete the poll group.
     */
    deleteAction(pollGroup: PollGroup): Promise<void>;
    /**
     * Show deletion alert of poll group
     */
    showDeletionAlert(pollGroup: PollGroup, type: string): void;
    /**
     * Edit the poll group.
     */
    editAction(pollGroup: PollGroup): void;
    /**
     * Add poll to group.
     */
    addPoll(pollGroup: PollGroup): void;
};
export default _default;
