import type Mithril from 'mithril';
import PollGroup from '../../models/PollGroup';
import PollList, { IPollListAttrs } from '../Poll/PollList';
export default class PollGroupList extends PollList<PollGroup, IPollListAttrs<PollGroup>> {
    className(): string;
    itemView(pollGroup: PollGroup): Mithril.Children;
    emptyText(): Mithril.Children;
    loadMoreText(): Mithril.Children;
}
