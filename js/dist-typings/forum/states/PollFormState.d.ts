import Poll from '../models/Poll';
export default class PollFormState {
    poll: Poll;
    loading: boolean;
    deleting: boolean;
    expandedGroup: string;
    static createNewPoll(): Poll;
    constructor(poll: Poll);
    isExpanded(groupKey: string): boolean;
    expand(groupKey: string): void;
    save(data: any): Promise<void>;
    delete(): Promise<void>;
}
