import bootstrapForum from '../../../bootstrap';
import { makePoll } from '../../../factory';
import PollListState from '../../../../src/forum/states/PollListState';
import PollGroupListState from '../../../../src/forum/states/PollGroupListState';

beforeAll(() => bootstrapForum());

function seed<T extends { getPages: () => unknown[] }>(state: T, items: unknown[]): T {
  (state as any).pages = [{ number: 1, items }];

  return state;
}

describe('PollListState', () => {
  it('falls back to the newest sort when none is set', () => {
    expect(new PollListState({}).getSort()).toBe('newest');
    expect(new PollListState({ sort: 'oldest' }).getSort()).toBe('oldest');
  });

  it('translates the configured API sort value back into a key', () => {
    expect(PollListState.sortKey('-voteCount')).toBe('most_voted');
    expect(PollListState.sortKey('nonsense')).toBe('newest');
  });

  it('offers relevance as a sort only while searching', () => {
    expect(Object.keys(new PollListState({}).sortMap())).not.toContain('relevance');
    expect(Object.keys(new PollListState({ q: 'cats' }).sortMap())).toContain('relevance');
  });

  it('asks the API for the sort behind the current key', () => {
    const params = new PollListState({ sort: 'least_voted', filter: { isDraft: '0' } }).requestParams();

    expect(params.sort).toBe('voteCount');
    expect(params.filter).toEqual({ isDraft: '0' });
    expect(params.include).toBe('options,votes');
  });

  it('carries a search term into the filter', () => {
    expect(new PollListState({ q: 'cats' }).requestParams().filter!.q).toBe('cats');
  });

  it('reports whether the list is search results', () => {
    expect(new PollListState({ q: 'cats' }).isSearchResults()).toBe(true);
    expect(new PollListState({}).isSearchResults()).toBe(false);
  });

  it('drops a deleted poll from every live list', () => {
    const poll = makePoll();
    const one = seed(new PollListState({}), [poll]);
    const two = seed(new PollListState({}), [poll]);

    PollListState.notifyDeleted(poll);

    expect(one.getPages()[0].items).toEqual([]);
    expect(two.getPages()[0].items).toEqual([]);
  });

  it('leaves poll group lists alone when a poll is deleted', () => {
    const poll = makePoll();
    const groups = seed(new PollGroupListState({}), [poll as any]);

    PollListState.notifyDeleted(poll);

    expect(groups.getPages()[0].items).toHaveLength(1);
  });
});
