import mq from 'mithril-query';
import app from 'flarum/forum/app';
import bootstrapForum from '../../../bootstrap';
import { makePoll } from '../../../factory';
import PollListItem from '../../../../src/forum/components/Poll/PollListItem';
import PollGroupListItem from '../../../../src/forum/components/PollGroup/PollGroupListItem';

beforeAll(() => {
  bootstrapForum();
  m.route.get = () => '/polls/all';
});

describe('PollListItem', () => {
  it('links the whole row to the poll', () => {
    const poll = makePoll();
    const out = mq(PollListItem, { poll });

    expect(out.rootEl.querySelector('a.PollListItem-main')!.getAttribute('href')).toBe(`/polls/view/${poll.id()}`);
  });

  it('says a poll never ends when it has no end date', () => {
    const out = mq(PollListItem, { poll: makePoll() });

    expect(out.rootEl.querySelector('.PollListItem-endStatus')!.textContent).toContain('Poll never ends');
  });

  it('shows the vote count when there is one to show', () => {
    const out = mq(PollListItem, { poll: makePoll({ voteCount: 12 }) });

    expect(out.rootEl.querySelector('.item-voteCount')!.textContent).toContain('12 votes');
  });

  it('leaves the vote count out when the API withholds it', () => {
    const out = mq(PollListItem, { poll: makePoll({ voteCount: undefined }) });

    expect(out).not.toHaveElement('.item-voteCount');
  });

  it('gives the mark-as-read control a name a screen reader can use', () => {
    const out = mq(PollListItem, { poll: makePoll() });

    expect(out.rootEl.querySelector('.Slidable-underneath')!.getAttribute('aria-label')).toBe('Mark as Read');
  });
});

describe('PollGroupListItem', () => {
  // A bare <span> used to be dropped straight into the <ul> here.
  it('uses a placeholder, not a stray list child, for an empty group', () => {
    const pollGroup = app.store.pushPayload<any>({
      data: { type: 'poll_groups', id: '90', attributes: { name: 'Empty' }, relationships: { polls: { data: [] } } },
    } as any);

    const out = mq(PollGroupListItem, { pollGroup });

    expect(out).toHaveElement('.Placeholder');
    expect(out).not.toHaveElement('ul.PollGroupListItem-polls');
  });

  it('lists the polls a group does have', () => {
    const poll = makePoll();

    const pollGroup = app.store.pushPayload<any>({
      data: {
        type: 'poll_groups',
        id: '91',
        attributes: { name: 'Full' },
        relationships: { polls: { data: [{ type: 'polls', id: poll.id() }] } },
      },
    } as any);

    const out = mq(PollGroupListItem, { pollGroup, compactView: true });

    expect(out.find('ul.PollGroupListItem-polls > li')).toHaveLength(1);
    expect(out).not.toHaveElement('.Placeholder');
  });
});
