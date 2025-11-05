import PollGroup from '../models/PollGroup';
export default class PollGroupFormState {
    pollGroup: PollGroup;
    loading: boolean;
    deleting: boolean;
    static createNewPollGroup(): PollGroup;
    constructor(pollGroup: PollGroup);
    save(data: any): Promise<void>;
    delete(): Promise<void>;
}
