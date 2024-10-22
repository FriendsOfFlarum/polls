import Mithril from 'mithril';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollOptionModel from '../../models/PollOption';
import PollState from '../../states/PollState';
import Tooltip, { TooltipAttrs } from 'flarum/common/components/Tooltip';
import ItemList from 'flarum/common/utils/ItemList';
import Poll from '../../models/Poll';
interface PollOptionAttrs extends ComponentAttrs {
    option: PollOptionModel;
    name: string;
    state: PollState;
}
export default class PollOption extends Component<PollOptionAttrs, PollState> {
    option: PollOptionModel;
    name: string;
    state: PollState;
    hasVoted: boolean;
    totalVotes: number;
    votes: number;
    voted: boolean;
    poll: Poll;
    canSeeVoteCount: boolean;
    answer: string;
    oninit(vnode: Mithril.Vnode<PollOptionAttrs, PollState>): void;
    percent(): number;
    view(): Mithril.Children;
    /**
     * Attempting to use the `tooltipVisible` attr on the Tooltip component set to 'false' when no vote count
     * caused the tooltip to break on click. This is a workaround to hide the tooltip when no vote count is available,
     * called on 'onremove' of the Tooltip component. It doesn't always work as intended either, but it does the job.
     */
    hideOptionTooltip(vnode: Mithril.Vnode<TooltipAttrs, Tooltip>): void;
    optionDisplayItems(): ItemList<Mithril.Children>;
}
export {};
