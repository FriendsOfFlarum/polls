import mq from 'mithril-query';
import app from 'flarum/forum/app';
import bootstrapForum from '../../../bootstrap';
import { makeOption, makePoll } from '../../../factory';
import PollView from '../../../../src/forum/components/PollView';

beforeAll(() => bootstrapForum());

function render(attributes: Record<string, unknown> = {}, voted: boolean = false) {
  const option = makeOption();
  const poll = makePoll(attributes, [option, makeOption()], voted ? [option.id()!] : []);

  return mq(PollView, { poll });
}

describe('PollView', () => {
  it('puts the question, options and footer together', () => {
    const out = render();

    expect(out).toHaveElement('.Poll .Poll-header .Poll-title');
    expect(out).toHaveElement('.Poll-content fieldset.Poll-optionsFieldset legend.sr-only');
    expect(out.find('.Poll-options .PollOption')).toHaveLength(2);
  });

  it('shows a subtitle only when the poll has one', () => {
    expect(render()).not.toHaveElement('.Poll-subtitle');
    expect(render({ subtitle: 'Pick one' })).toHaveElement('.Poll-subtitle');
  });

  it('offers no controls menu when the reader may do nothing', () => {
    expect(render()).not.toHaveElement('.Poll-controls');
  });

  it('offers a controls menu to someone who may see the voters', () => {
    expect(render({ publicPoll: true })).toHaveElement('.Poll-controls .Dropdown-toggle');
  });

  it('tells the reader when the poll has ended', () => {
    const out = render({ hasEnded: true, endDate: '2020-01-01T00:00:00+00:00' });

    expect(out.rootEl.querySelector('.PollInfoText')!.textContent).toContain('This poll has ended.');
  });

  it('counts down to an end date that has not arrived', () => {
    const out = render({ endDate: dayjs().add(5, 'day').toISOString() });

    expect(out.rootEl.querySelector('.PollInfoText')!.textContent).toContain('in 5 days');
  });

  it('counts the votes once the reader has voted', () => {
    const out = render({ voteCount: 3 }, true);

    expect(out.rootEl.querySelector('.PollInfoText')!.textContent).toContain('3 votes were given');
  });

  it('gives no total when the vote count is hidden', () => {
    const out = render({ voteCount: undefined, hasEnded: true, endDate: '2020-01-01T00:00:00+00:00' });

    expect(out.rootEl.querySelector('.PollInfoText')!.textContent).not.toContain('were given');
  });

  it('gives a voter no total while votes are hidden until the poll ends', () => {
    const out = render({ voteCount: undefined, hideVotes: true, endDate: dayjs().add(5, 'day').toISOString() }, true);

    expect(out.rootEl.querySelector('.PollInfoText')!.textContent).not.toContain('were given');
  });

  it('shows the draft pill for a draft poll', () => {
    const out = render({ isDraft: true });

    expect(out).toHaveElement('.PollDraftBadges .PollDraftBadges-draft');
    expect(out.rootEl.querySelector('.PollDraftBadges-draft')!.textContent).toContain('Draft');
  });

  it('shows no pills for a published poll', () => {
    expect(render()).not.toHaveElement('.PollDraftBadges');
  });
});
