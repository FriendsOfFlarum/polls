import { jest } from '@jest/globals';
import app from 'flarum/forum/app';
import bootstrapForum from '../../../bootstrap';
import { makeOption, makePoll } from '../../../factory';
import PollState from '../../../../src/forum/states/PollState';

beforeAll(() => bootstrapForum());

function signedIn(): void {
  (app.session as any).user = app.store.createRecord('users');
}

function signedOut(): void {
  (app.session as any).user = null;
}

function state(attributes: Record<string, unknown> = {}, votedOn: number = -1) {
  const options = [makeOption(), makeOption(), makeOption()];
  const poll = makePoll(attributes, options, votedOn >= 0 ? [options[votedOn].id()!] : []);

  return { poll, options, state: new PollState(poll) };
}

afterEach(() => signedOut());

describe('PollState', () => {
  describe('canSeeVoteCount', () => {
    it('is true while the API reports a count', () => {
      expect(state({ voteCount: 0 }).state.canSeeVoteCount).toBe(true);
    });

    it('is false when the API withholds the count', () => {
      expect(state({ voteCount: undefined }).state.canSeeVoteCount).toBe(false);
    });
  });

  describe('canSelect', () => {
    it('lets a guest click, so they can be asked to log in', () => {
      expect(state().state.canSelect()).toBe(true);
    });

    it('is closed once the poll has ended, guest or not', () => {
      expect(state({ hasEnded: true }).state.canSelect()).toBe(false);

      signedIn();
      expect(state({ hasEnded: true }).state.canSelect()).toBe(false);
    });

    it('is closed to someone without permission to vote', () => {
      signedIn();
      expect(state({ canVote: false }).state.canSelect()).toBe(false);
    });

    it('is closed after voting when the vote cannot be changed', () => {
      signedIn();
      expect(state({ canChangeVote: false }, 0).state.canSelect()).toBe(false);
      expect(state({ canChangeVote: true }, 0).state.canSelect()).toBe(true);
    });

    it('is closed while a vote is in flight', () => {
      const { state: s } = state();
      s.loadingOptions = true;

      expect(s.canSelect()).toBe(false);
    });
  });

  describe('vote bookkeeping', () => {
    it('knows whether the reader voted, and for what', () => {
      const { state: s, options } = state({}, 1);

      expect(s.hasVoted()).toBe(true);
      expect(s.hasVotedFor(options[1])).toBe(true);
      expect(s.hasVotedFor(options[0])).toBe(false);
    });

    it('caps a single-vote poll at one, and a capless multi-vote poll at the option count', () => {
      expect(state().state.getMaxVotes()).toBe(1);
      expect(state({ allowMultipleVotes: true, maxVotes: 2 }).state.getMaxVotes()).toBe(2);
      expect(state({ allowMultipleVotes: true, maxVotes: 0 }).state.getMaxVotes()).toBe(3);
    });

    it('shows results once the poll has ended', () => {
      expect(state({ hasEnded: true }).state.isShowResult()).toBe(true);
      expect(state().state.isShowResult()).toBe(false);
    });
  });

  describe('changeVote', () => {
    let request: any;

    beforeEach(() => {
      signedIn();
      request = jest.spyOn(app, 'request').mockImplementation(() => Promise.resolve({ data: [] }) as any);
    });

    afterEach(() => request.mockRestore());

    function change(s: PollState, option: any) {
      s.changeVote(option, { target: {} } as any);
    }

    it('sends the chosen option straight away on a single-vote poll', () => {
      const { state: s, options } = state();

      change(s, options[0]);

      expect(request).toHaveBeenCalled();
      expect((request.mock.calls[0][0] as any).body.data.optionIds).toEqual([options[0].id()]);
    });

    it('replaces the previous choice rather than adding to it', () => {
      const { state: s, options } = state({}, 0);

      change(s, options[1]);

      expect((request.mock.calls[0][0] as any).body.data.optionIds).toEqual([options[1].id()]);
    });

    it('clicking the current choice again withdraws it', () => {
      const { state: s, options } = state({}, 0);

      change(s, options[0]);

      expect((request.mock.calls[0][0] as any).body.data.optionIds).toEqual([]);
    });

    it('keeps earlier choices on a multi-vote poll', () => {
      const { state: s, options } = state({ allowMultipleVotes: true }, 0);

      change(s, options[1]);

      expect((request.mock.calls[0][0] as any).body.data.optionIds).toEqual([options[0].id(), options[1].id()]);
    });

    it('waits for a submit button when votes cannot be changed afterwards', () => {
      const { state: s, options } = state({ allowMultipleVotes: true, canChangeVote: false });

      expect(s.useSubmitUI).toBe(true);

      change(s, options[0]);

      expect(request).not.toHaveBeenCalled();
      expect(s.showButton()).toBe(true);
    });

    it('asks a guest to log in instead of voting', () => {
      signedOut();

      const modal = jest.spyOn(app.modal, 'show').mockResolvedValue(undefined);
      const { state: s, options } = state();

      change(s, options[0]);

      expect(modal).toHaveBeenCalled();
      expect(request).not.toHaveBeenCalled();

      modal.mockRestore();
    });
  });
});
