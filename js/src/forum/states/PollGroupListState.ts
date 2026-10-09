import PollGroup from '../models/PollGroup';
import AbstractPollListState, { PollListParams, pollListEmitter } from './AbstractPollListState';

export type PollGroupListParams = PollListParams;

const DELETED = 'pollgroup.deleted';

export default class PollGroupListState<P extends PollGroupListParams = PollGroupListParams> extends AbstractPollListState<PollGroup, P> {
  static notifyDeleted(pollGroup: PollGroup): void {
    pollListEmitter.emit(DELETED, pollGroup);
  }

  get type(): string {
    return 'poll_groups';
  }

  protected deletedEvent(): string {
    return DELETED;
  }

  protected defaultSort(): string {
    return 'newest';
  }

  includes(): string[] {
    return ['polls'];
  }

  sortMap(): Record<string, string> {
    const map: Record<string, string> = {};

    if (this.params.q) map.relevance = '';

    map.newest = '-createdAt';
    map.oldest = 'createdAt';

    return map;
  }
}
