import Model from 'flarum/common/Model';
import Poll from './Poll';
import PollVote from './PollVote';
export default class PollOption extends Model {
    answer(): string;
    imageUrl(): string | null;
    isImageUpload(): boolean;
    voteCount(): number;
    poll(): false | Poll;
    votes(): false | (PollVote | undefined)[];
    apiEndpoint(): string;
}
