import bootstrapForum from '../../../bootstrap';
import { makePoll } from '../../../factory';
import PollFormState from '../../../../src/forum/states/PollFormState';

beforeAll(() => bootstrapForum());

describe('PollFormState', () => {
  it('starts a new poll with two blank answers ready', () => {
    const poll = PollFormState.createNewPoll();

    expect(poll.exists).toBe(false);
    expect(poll.question()).toBe('');
    expect(poll.tempOptions).toHaveLength(2);
  });

  it('builds its own poll when handed none', () => {
    expect(new PollFormState(undefined as any).poll.exists).toBe(false);
  });

  it('counts an unsaved poll as new, and a saved one as not', () => {
    expect(new PollFormState(PollFormState.createNewPoll()).isNew()).toBe(true);
    expect(new PollFormState(makePoll()).isNew()).toBe(false);
  });

  it('only calls a saved poll a draft', () => {
    expect(new PollFormState(makePoll({ isDraft: true })).isDraft()).toBe(true);
    expect(new PollFormState(makePoll({ isDraft: false })).isDraft()).toBe(false);
    expect(new PollFormState(PollFormState.createNewPoll()).isDraft()).toBe(false);
  });

  it('tracks whether the form has unsaved edits', () => {
    const state = new PollFormState(PollFormState.createNewPoll());

    expect(state.dirty).toBe(false);

    state.markDirty();
    expect(state.dirty).toBe(true);

    state.markDirty(false);
    expect(state.dirty).toBe(false);
  });
});
