import PollGroup from '../models/PollGroup';
import AbstractPollListState, { PollListParams } from './AbstractPollListState';
export type PollGroupListParams = PollListParams;
export default class PollGroupListState<P extends PollGroupListParams = PollGroupListParams> extends AbstractPollListState<PollGroup, P> {
    static notifyDeleted(pollGroup: PollGroup): void;
    get type(): string;
    protected deletedEvent(): string;
    protected defaultSort(): string;
    includes(): string[];
    sortMap(): Record<string, string>;
}
