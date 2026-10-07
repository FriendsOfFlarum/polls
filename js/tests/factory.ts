import app from 'flarum/forum/app';
import Poll from '../src/forum/models/Poll';
import PollOption from '../src/forum/models/PollOption';

let nextId = 1;

export function resetIds(): void {
  nextId = 1;
}

export function makeOption(attributes: Record<string, unknown> = {}): PollOption {
  const id = String(nextId++);

  return app.store.pushPayload<PollOption>({
    data: {
      type: 'poll_options',
      id,
      attributes: { answer: `Answer ${id}`, imageUrl: null, imageSrcset: null, voteCount: 0, ...attributes },
    },
  } as any) as unknown as PollOption;
}

export function makePoll(attributes: Record<string, unknown> = {}, options: PollOption[] = [], myVoteOptionIds: string[] = []): Poll {
  const id = String(nextId++);

  const votes = myVoteOptionIds.map((optionId) => {
    const voteId = String(nextId++);

    app.store.pushPayload({
      data: {
        type: 'poll_votes',
        id: voteId,
        attributes: {},
        relationships: { option: { data: { type: 'poll_options', id: optionId } } },
      },
    } as any);

    return { type: 'poll_votes', id: voteId };
  });

  return app.store.pushPayload<Poll>({
    data: {
      type: 'polls',
      id,
      attributes: {
        question: `Question ${id}`,
        subtitle: null,
        imageUrl: null,
        imageAlt: null,
        imageSrcset: null,
        hasEnded: false,
        endDate: null,
        publicPoll: false,
        hideVotes: false,
        allowChangeVote: true,
        allowMultipleVotes: false,
        maxVotes: 0,
        voteCount: 0,
        canVote: true,
        canEdit: false,
        canDelete: false,
        canSeeVoters: false,
        canChangeVote: true,
        isGlobal: false,
        isDraft: false,
        ...attributes,
      },
      relationships: {
        options: { data: options.map((option) => ({ type: 'poll_options', id: option.id() })) },
        myVotes: { data: votes },
      },
    },
  } as any) as unknown as Poll;
}
