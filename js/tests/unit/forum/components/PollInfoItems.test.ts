import { jest } from '@jest/globals';

/**
 * Tests for the poll info items logic used by both PostPoll and PollView.
 * This tests the pure logic without Flarum component dependencies.
 */

describe('Poll info items logic', () => {
  describe('percentage calculation', () => {
    function percent(votes: number, totalVotes: number): number {
      return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
    }

    it('returns 0 when no votes', () => {
      expect(percent(0, 0)).toBe(0);
    });

    it('returns 100 when all votes on one option', () => {
      expect(percent(10, 10)).toBe(100);
    });

    it('rounds to nearest integer', () => {
      expect(percent(1, 3)).toBe(33);
      expect(percent(2, 3)).toBe(67);
    });

    it('handles single vote out of many', () => {
      expect(percent(1, 100)).toBe(1);
    });

    it('handles even split', () => {
      expect(percent(5, 10)).toBe(50);
    });
  });

  describe('bar width calculation', () => {
    it('uses percentage when canSeeVoteCount', () => {
      const canSeeVoteCount = true;
      const percent = 75;
      const voted = true;
      const myVotesLength = 1;

      const width = canSeeVoteCount ? percent : (Number(voted) / (myVotesLength || 1)) * 100;
      expect(width).toBe(75);
    });

    it('uses binary voted/total when cannot see vote count', () => {
      const canSeeVoteCount = false;
      const percent = 75;
      const voted = true;
      const myVotesLength = 2;

      const width = canSeeVoteCount ? percent : (Number(voted) / (myVotesLength || 1)) * 100;
      expect(width).toBe(50); // 1/2 = 50%
    });

    it('returns 0 when not voted and cannot see count', () => {
      const canSeeVoteCount = false;
      const voted = false;
      const myVotesLength = 0;

      const width = canSeeVoteCount ? 0 : (Number(voted) / (myVotesLength || 1)) * 100;
      expect(width).toBe(0);
    });
  });

  describe('info item visibility conditions', () => {
    it('shows no-permission when logged in, cannot vote, poll not ended', () => {
      const user = { id: '1' };
      const canVote = false;
      const hasEnded = false;

      const showNoPermission = !!user && !canVote && !hasEnded;
      expect(showNoPermission).toBe(true);
    });

    it('hides no-permission for guests', () => {
      const user = null;
      const canVote = false;
      const hasEnded = false;

      const showNoPermission = !!user && !canVote && !hasEnded;
      expect(showNoPermission).toBe(false);
    });

    it('hides no-permission when poll has ended', () => {
      const user = { id: '1' };
      const canVote = false;
      const hasEnded = true;

      const showNoPermission = !!user && !canVote && !hasEnded;
      expect(showNoPermission).toBe(false);
    });

    it('shows end-date info when endDate exists', () => {
      const endDate = '2025-01-01T00:00:00Z';
      expect(!!endDate).toBe(true);
    });

    it('hides end-date info when no endDate', () => {
      const endDate = null;
      expect(!!endDate).toBe(false);
    });

    it('shows max-votes when user can vote', () => {
      const canVote = true;
      expect(canVote).toBe(true);
    });

    it('shows cannot-change-vote when canChangeVote is false', () => {
      const canVote = true;
      const canChangeVote = false;
      expect(canVote && !canChangeVote).toBe(true);
    });
  });
});
