import Model from 'flarum/common/Model';
import PollOption from './PollOption';
import PollVote from './PollVote';
import PollGroup from './PollGroup';
export default class Poll extends Model {
    tempOptions: PollOption[] | undefined;
    question(): string;
    subtitle(): string | null;
    image(): string | null;
    imageUrl(): string | null;
    imageSrcset(): string | null;
    imageAlt(): string | null;
    /** @deprecated Use imageSrcset() presence instead */
    isImageUpload(): boolean;
    hasEnded(): boolean;
    endDate(): Date | null | undefined;
    publicPoll(): boolean;
    hideVotes(): boolean;
    allowChangeVote(): boolean;
    allowMultipleVotes(): boolean;
    maxVotes(): number;
    voteCount(): number;
    canVote(): boolean;
    canEdit(): boolean;
    canDelete(): boolean;
    canSeeVoters(): boolean;
    canChangeVote(): boolean;
    options(): PollOption[];
    votes(): false | (PollVote | undefined)[];
    myVotes(): PollVote[];
    pollGroup(): false | PollGroup;
    isGlobal(): boolean;
    isHidden(): boolean;
    isUnread(): boolean;
    publishedAt(): Date | null;
    scheduledPublishAt(): Date | null;
    scheduledPublishError(): string | null;
    isDraft(): boolean;
    isScheduled(): boolean;
    canPublish(): boolean;
    canUnpublish(): boolean;
    publish(body?: {
        scheduledFor?: string | null;
    }): Promise<this>;
    unpublish(): Promise<this>;
}
