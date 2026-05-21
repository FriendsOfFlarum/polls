import type Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Poll from '../../models/Poll';
export interface IPollDraftBadgesAttrs extends ComponentAttrs {
    poll: Poll;
}
/**
 * Renders the "Draft" and (optional) "Scheduled" status pills for a poll.
 * Shared between the poll list row and the poll view page so both surfaces
 * expose the same visual cue.
 */
export default class PollDraftBadges extends Component<IPollDraftBadgesAttrs> {
    view(): Mithril.Children;
}
