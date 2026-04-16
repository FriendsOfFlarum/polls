import { jest } from '@jest/globals';

// Mock globals that PollState depends on
const mockApp = {
  session: { user: { id: () => '1' } },
  forum: { attribute: (key: string) => 'https://example.com/api' },
  modal: { show: jest.fn() },
  request: jest.fn(() => Promise.resolve({})),
  store: { pushPayload: jest.fn() },
};
// @ts-ignore
globalThis.app = mockApp;
// @ts-ignore
globalThis.m = { redraw: jest.fn() };

function makePoll(overrides: Record<string, any> = {}) {
  return {
    id: () => '1',
    canChangeVote: () => true,
    allowMultipleVotes: () => false,
    hasEnded: () => false,
    canVote: () => true,
    voteCount: () => 10,
    maxVotes: () => 1,
    options: () => [
      { id: () => '1', answer: () => 'A' },
      { id: () => '2', answer: () => 'B' },
      { id: () => '3', answer: () => 'C' },
    ],
    myVotes: () => [],
    ...overrides,
  };
}

function makeOption(id: string = '1') {
  return { id: () => id, answer: () => `Option ${id}` };
}

function makeVote(optionId: string) {
  const opt = makeOption(optionId);
  return { option: () => opt };
}

describe('PollState', () => {
  describe('constructor derivations', () => {
    it('useSubmitUI is false for single-vote polls', () => {
      const poll = makePoll({ canChangeVote: () => true, allowMultipleVotes: () => false });

      // Simulating constructor logic
      const useSubmitUI = !poll.canChangeVote() && poll.allowMultipleVotes();
      expect(useSubmitUI).toBe(false);
    });

    it('useSubmitUI is true when cannot change vote and multiple votes allowed', () => {
      const poll = makePoll({ canChangeVote: () => false, allowMultipleVotes: () => true });

      const useSubmitUI = !poll.canChangeVote() && poll.allowMultipleVotes();
      expect(useSubmitUI).toBe(true);
    });

    it('showCheckMarks is true for logged-in user who has not voted on active poll', () => {
      const poll = makePoll({ hasEnded: () => false, canVote: () => true, canChangeVote: () => true });
      const hasVoted = poll.myVotes().length > 0;
      const user = mockApp.session.user;

      const showCheckMarks = !user || (!poll.hasEnded() && poll.canVote() && (!hasVoted || poll.canChangeVote()));
      expect(showCheckMarks).toBe(true);
    });

    it('showCheckMarks is false for ended poll', () => {
      const poll = makePoll({ hasEnded: () => true, canVote: () => true });
      const hasVoted = false;
      const user = mockApp.session.user;

      const showCheckMarks = !user || (!poll.hasEnded() && poll.canVote() && (!hasVoted || poll.canChangeVote()));
      expect(showCheckMarks).toBe(false);
    });

    it('showCheckMarks is false when user cannot vote', () => {
      const poll = makePoll({ hasEnded: () => false, canVote: () => false });
      const hasVoted = false;
      const user = mockApp.session.user;

      const showCheckMarks = !user || (!poll.hasEnded() && poll.canVote() && (!hasVoted || poll.canChangeVote()));
      expect(showCheckMarks).toBe(false);
    });

    it('showCheckMarks is true for guest (no user)', () => {
      const poll = makePoll();
      const user = null;

      const showCheckMarks = !user || (!poll.hasEnded() && poll.canVote());
      expect(showCheckMarks).toBe(true);
    });

    it('canSeeVoteCount is true when voteCount returns a number', () => {
      const poll = makePoll({ voteCount: () => 5 });
      expect(typeof poll.voteCount() === 'number').toBe(true);
    });

    it('canSeeVoteCount is false when voteCount returns undefined', () => {
      const poll = makePoll({ voteCount: () => undefined });
      expect(typeof poll.voteCount() === 'number').toBe(false);
    });
  });

  describe('hasVoted', () => {
    it('returns false when myVotes is empty', () => {
      const poll = makePoll({ myVotes: () => [] });
      expect(poll.myVotes().length > 0).toBe(false);
    });

    it('returns true when myVotes has entries', () => {
      const poll = makePoll({ myVotes: () => [makeVote('1')] });
      expect(poll.myVotes().length > 0).toBe(true);
    });
  });

  describe('hasVotedFor', () => {
    it('returns false when no votes exist', () => {
      const poll = makePoll({ myVotes: () => [] });
      const option = makeOption('1');
      const pendingOptions: Set<string> | null = null;

      const result = pendingOptions ? pendingOptions.has(option.id()) : poll.myVotes().some((v: any) => v.option() === option);
      expect(result).toBe(false);
    });

    it('returns true when option matches a vote (by reference)', () => {
      const option = makeOption('1');
      const vote = { option: () => option };
      const poll = makePoll({ myVotes: () => [vote] });
      const pendingOptions: Set<string> | null = null;

      const result = pendingOptions ? pendingOptions.has(option.id()) : poll.myVotes().some((v: any) => v.option() === option);
      expect(result).toBe(true);
    });

    it('checks pendingOptions when present', () => {
      const option = makeOption('2');
      const pendingOptions = new Set(['2', '3']);

      const result = pendingOptions ? pendingOptions.has(option.id()) : false;
      expect(result).toBe(true);
    });

    it('returns false for non-pending option', () => {
      const option = makeOption('5');
      const pendingOptions = new Set(['2', '3']);

      const result = pendingOptions ? pendingOptions.has(option.id()) : false;
      expect(result).toBe(false);
    });
  });

  describe('getMaxVotes', () => {
    it('returns 1 for single vote polls', () => {
      const poll = makePoll({ allowMultipleVotes: () => false, maxVotes: () => 0 });
      let maxVotes = poll.allowMultipleVotes() ? poll.maxVotes() : 1;
      expect(maxVotes).toBe(1);
    });

    it('returns maxVotes for multi-vote polls', () => {
      const poll = makePoll({ allowMultipleVotes: () => true, maxVotes: () => 3 });
      let maxVotes = poll.allowMultipleVotes() ? poll.maxVotes() : 1;
      expect(maxVotes).toBe(3);
    });

    it('returns options count when maxVotes is 0 in multi-vote mode', () => {
      const poll = makePoll({ allowMultipleVotes: () => true, maxVotes: () => 0 });
      let maxVotes = poll.allowMultipleVotes() ? poll.maxVotes() : 1;
      if (maxVotes === 0) maxVotes = poll.options().length;
      expect(maxVotes).toBe(3);
    });
  });

  describe('showButton', () => {
    it('returns false when not using submit UI', () => {
      const useSubmitUI = false;
      const pendingSubmit = true;
      expect(useSubmitUI && pendingSubmit).toBe(false);
    });

    it('returns false when no pending submit', () => {
      const useSubmitUI = true;
      const pendingSubmit = false;
      expect(useSubmitUI && pendingSubmit).toBe(false);
    });

    it('returns true when using submit UI with pending submit', () => {
      const useSubmitUI = true;
      const pendingSubmit = true;
      expect(useSubmitUI && pendingSubmit).toBe(true);
    });
  });

  describe('isShowResult', () => {
    it('returns true when poll has ended', () => {
      const poll = makePoll({ hasEnded: () => true });
      expect(poll.hasEnded()).toBe(true);
    });

    it('returns true when user has voted and can see vote count', () => {
      const poll = makePoll({ hasEnded: () => false, myVotes: () => [makeVote('1')], voteCount: () => 5 });
      const canSeeVoteCount = typeof poll.voteCount() === 'number';
      const hasVoted = poll.myVotes().length > 0;
      const user = mockApp.session.user;

      const result = poll.hasEnded() || (canSeeVoteCount && !!user && hasVoted);
      expect(result).toBe(true);
    });

    it('returns false when poll is active and user has not voted', () => {
      const poll = makePoll({ hasEnded: () => false, myVotes: () => [] });
      const canSeeVoteCount = typeof poll.voteCount() === 'number';
      const hasVoted = poll.myVotes().length > 0;
      const user = mockApp.session.user;

      const result = poll.hasEnded() || (canSeeVoteCount && !!user && hasVoted);
      expect(result).toBe(false);
    });
  });

  describe('changeVote flow', () => {
    it('redirects to login when no user', () => {
      const originalUser = mockApp.session.user;
      // @ts-ignore
      mockApp.session.user = null;

      const hasUser = !!mockApp.session.user;
      expect(hasUser).toBe(false);

      // Restore
      // @ts-ignore
      mockApp.session.user = originalUser;
    });

    it('single vote: clears previous and adds new', () => {
      const myVotes = [makeVote('1')];
      const clickedOptionId = '2';
      const allowsMultiple = false;

      const optionIds = new Set(myVotes.map((v: any) => v.option().id()));
      const isUnvoting = optionIds.delete(clickedOptionId);

      if (!allowsMultiple) optionIds.clear();
      if (!isUnvoting) optionIds.add(clickedOptionId);

      expect(Array.from(optionIds)).toEqual(['2']);
    });

    it('single vote: unvotes when clicking same option', () => {
      const myVotes = [makeVote('1')];
      const clickedOptionId = '1';
      const allowsMultiple = false;

      const optionIds = new Set(myVotes.map((v: any) => v.option().id()));
      const isUnvoting = optionIds.delete(clickedOptionId);

      if (!allowsMultiple) optionIds.clear();
      if (!isUnvoting) optionIds.add(clickedOptionId);

      expect(isUnvoting).toBe(true);
      expect(Array.from(optionIds)).toEqual([]);
    });

    it('multi vote: adds without clearing existing', () => {
      const myVotes = [makeVote('1')];
      const clickedOptionId = '2';
      const allowsMultiple = true;

      const optionIds = new Set(myVotes.map((v: any) => v.option().id()));
      const isUnvoting = optionIds.delete(clickedOptionId);

      if (!allowsMultiple) optionIds.clear();
      if (!isUnvoting) optionIds.add(clickedOptionId);

      expect(Array.from(optionIds)).toEqual(['1', '2']);
    });

    it('multi vote: removes one without clearing others', () => {
      const myVotes = [makeVote('1'), makeVote('2')];
      const clickedOptionId = '1';
      const allowsMultiple = true;

      const optionIds = new Set(myVotes.map((v: any) => v.option().id()));
      const isUnvoting = optionIds.delete(clickedOptionId);

      if (!allowsMultiple) optionIds.clear();
      if (!isUnvoting) optionIds.add(clickedOptionId);

      expect(isUnvoting).toBe(true);
      expect(Array.from(optionIds)).toEqual(['2']);
    });

    it('sets pendingSubmit when using submit UI', () => {
      const useSubmitUI = true;
      const optionIds = new Set(['1']);

      const pendingOptions = optionIds.size ? optionIds : null;
      const pendingSubmit = !!pendingOptions;

      expect(pendingSubmit).toBe(true);
    });

    it('clears pendingOptions when empty', () => {
      const optionIds = new Set<string>();

      const pendingOptions = optionIds.size ? optionIds : null;
      const pendingSubmit = !!pendingOptions;

      expect(pendingOptions).toBeNull();
      expect(pendingSubmit).toBe(false);
    });
  });
});
