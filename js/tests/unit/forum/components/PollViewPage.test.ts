import mq from 'mithril-query';
import app from 'flarum/forum/app';
import { jest } from '@jest/globals';
import bootstrapForum from '../../../bootstrap';
import { makeOption, makePoll } from '../../../factory';
import PollViewPage from '../../../../src/forum/components/PollViewPage';
import PollGroupViewPage from '../../../../src/forum/components/PollGroupViewPage';

beforeAll(() => bootstrapForum());

let find: any;

beforeEach(() => {
  m.route.set = (() => {}) as any;
  m.route.get = () => '/polls/view/1';
  find = jest.spyOn(app.store, 'find');
});

afterEach(() => find.mockRestore());

function routeTo(id: string): void {
  m.route.param = ((key: string) => (key === 'id' ? id : undefined)) as any;
}

describe('PollViewPage', () => {
  it('refetches a poll that was cached without its options', () => {
    const poll = makePoll({}, []);
    find.mockImplementation(() => new Promise(() => {}));
    routeTo(poll.id()!);

    const out = mq(PollViewPage, {});

    expect(find).toHaveBeenCalledWith('polls', poll.id());
    expect(out).not.toHaveElement('.Poll');
    expect(out).toHaveElement('.LoadingIndicator');
  });

  it('shows a cached poll straight away once it has its options', () => {
    const poll = makePoll({}, [makeOption(), makeOption()]);
    find.mockImplementation(() => new Promise(() => {}));
    routeTo(poll.id()!);

    const out = mq(PollViewPage, {});

    expect(out).toHaveElement('.Poll .PollOption');
  });
});

describe('PollGroupViewPage', () => {
  beforeEach(() => app.forum.pushAttributes({ canViewPollGroups: true }));

  function makeGroup(id: string, pollIds: string[]) {
    return app.store.pushPayload<any>({
      data: {
        type: 'poll_groups',
        id,
        attributes: { name: 'Release planning', canEdit: false, canDelete: false },
        relationships: { polls: { data: pollIds.map((pollId) => ({ type: 'polls', id: pollId })) } },
      },
    } as any);
  }

  it('refetches a group whose polls were cached without their options', () => {
    const poll = makePoll({}, []);
    const group = makeGroup('900', [poll.id()!]);
    find.mockImplementation(() => new Promise(() => {}));
    routeTo(group.id()!);

    const out = mq(PollGroupViewPage, {});

    expect(find).toHaveBeenCalledWith('poll_groups', group.id());
    expect(out).toHaveElement('.LoadingIndicator');
  });

  it('shows a cached group whose polls are complete', () => {
    const poll = makePoll({}, [makeOption(), makeOption()]);
    const group = makeGroup('901', [poll.id()!]);
    find.mockImplementation(() => new Promise(() => {}));
    routeTo(group.id()!);

    const out = mq(PollGroupViewPage, {});

    expect(out).toHaveElement('.PollGroupListItem');
    expect(out).not.toHaveElement('.LoadingIndicator');
  });
});
