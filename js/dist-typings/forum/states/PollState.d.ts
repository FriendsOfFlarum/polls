import Poll from '../models/Poll';
import PollOption from '../models/PollOption';
export default class PollState {
    poll: Poll;
    protected pendingSubmit: boolean;
    protected pendingOptions: Set<string> | null;
    loadingOptions: boolean;
    useSubmitUI: boolean;
    showCheckMarks: boolean;
    canSeeVoteCount: boolean;
    constructor(poll: Poll);
    /**
     * used as en extendable entry point for init customizations
     */
    init(): void;
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
