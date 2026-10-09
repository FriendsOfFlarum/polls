import Poll from '../models/Poll';
import AbstractPollListState, { PollListParams, pollListEmitter } from './AbstractPollListState';

export type { PollListParams };

const DELETED = 'poll.deleted';

const SORTS: Record<string, string> = {
  newest: '-createdAt',
  oldest: 'createdAt',
  most_voted: '-voteCount',
  least_voted: 'voteCount',
};

export default class PollListState<P extends PollListParams = PollListParams> extends AbstractPollListState<Poll, P> {
  static notifyDeleted(poll: Poll): void {
    pollListEmitter.emit(DELETED, poll);
  }

  static sortKey(apiValue: string): string {
    return Object.keys(SORTS).find((key) => SORTS[key] === apiValue) || 'newest';
  }

  get type(): string {
    return 'polls';
  }

  protected deletedEvent(): string {
    return DELETED;
  }

  protected defaultSort(): string {
    return 'newest';
  }

  includes(): string[] {
    return ['options', 'votes'];
  }

  sortMap(): Record<string, string> {
    return this.params.q ? { relevance: '', ...SORTS } : { ...SORTS };
  }
}
