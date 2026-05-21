import Poll from '../models/Poll';
export default class PollFormState {
    poll: Poll;
    loading: boolean;
    deleting: boolean;
    expandedGroup: string;
    dirty: boolean;
    static createNewPoll(): Poll;
    constructor(poll: Poll);
    isNew(): boolean;
    isDraft(): boolean;
    markDirty(value?: boolean): void;
    isExpanded(groupKey: string): boolean;
    expand(groupKey: string): void;
    save(data: any): Promise<void>;
    delete(): Promise<void>;
}
