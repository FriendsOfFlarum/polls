import Model from 'flarum/common/Model';
import Poll from './Poll';
import PollOption from './PollOption';
import User from 'flarum/common/models/User';
export default class PollVote extends Model {
    poll(): false | Poll;
    option(): PollOption | null;
    user(): false | User;
    pollId(): number;
    optionId(): number;
    apiEndpoint(): string;
}
