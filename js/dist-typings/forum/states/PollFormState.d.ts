import Poll from '../models/Poll';
export default class PollFormState {
    poll: Poll;
    loading: boolean;
    deleting: boolean;
    dirty: boolean;
    static createNewPoll(): Poll;
    constructor(poll: Poll);
    isNew(): boolean;
    isDraft(): boolean;
    markDirty(value?: boolean): void;
    save(data: any): Promise<void>;
    delete(): Promise<void>;
}
