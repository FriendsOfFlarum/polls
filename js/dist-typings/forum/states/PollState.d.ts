import Post from 'flarum/common/models/Post';
import Poll from '../models/Poll';
import PollOption from '../models/PollOption';
export default class PollState {
    poll: Poll;
    post?: Post;
    loadingOptions: boolean;
    protected pendingSubmit: boolean;
    protected pendingOptions: Set<string> | null;
    constructor(poll: Poll, post?: Post);
    init(): void;
    get canSeeVoteCount(): boolean;
    get useSubmitUI(): boolean;
    canSelect(): boolean;
    isShowResult(): boolean;
    hasVoted(): boolean;
    overallVoteCount(): number;
    hasVotedFor(option: PollOption): boolean;
    getMaxVotes(): number;
    showButton(): boolean;
    changeVote(option: PollOption, evt: Event): void;
    hasSelectedOptions(): boolean;
    onsubmit(): Promise<void>;
    submit(optionIds: Set<string>, cb: Function | null, onerror?: Function | null): Promise<void>;
    showVoters: () => void;
}
