import type Mithril from 'mithril';
import Poll from '../models/Poll';
import Component from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
/**
 * The `UserControls` utility constructs a list of buttons for a user which
 * perform actions on it.
 */
declare const _default: {
    /**
     * Get a list of controls for a user.
     */
    controls(poll: Poll, context: Component): ItemList<Mithril.Children>;
    /**
     * Get controls for direct modifcation actions on polls (e.g. vote, view voters).
     */
    pollControls(poll: Poll, context: Component): ItemList<Mithril.Children>;
    /**
     * Get controls for a user pertaining to moderation (e.g. suspend, edit).
     */
    moderationControls(poll: Poll, context: Component): ItemList<Mithril.Children>;
    /**
     * Get controls for a user which are destructive (e.g. delete).
     * @protected
     */
    destructiveControls(poll: Poll, context: Component): ItemList<Mithril.Children>;
    /**
     * Delete the poll.
     */
    deleteAction(poll: Poll): Promise<void>;
    /**
     * Show deletion alert of poll
     */
    showDeletionAlert(poll: Poll, type: string): void;
    /**
     * Edit the poll.
     */
    editAction(poll: Poll): void;
};
export default _default;
