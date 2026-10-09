import Poll from '../models/Poll';
import AbstractPollListState, { PollListParams } from './AbstractPollListState';
export type { PollListParams };
export default class PollListState<P extends PollListParams = PollListParams> extends AbstractPollListState<Poll, P> {
    static notifyDeleted(poll: Poll): void;
    static sortKey(apiValue: string): string;
    get type(): string;
    protected deletedEvent(): string;
    protected defaultSort(): string;
    includes(): string[];
    sortMap(): Record<string, string>;
}
