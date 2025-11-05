import PaginatedListState, { Page, PaginatedListParams, PaginatedListRequestParams } from 'flarum/common/states/PaginatedListState';
import EventEmitter from 'flarum/common/utils/EventEmitter';
import { ApiResponsePlural } from 'flarum/common/Store';
import PollGroup from '../models/PollGroup';
export interface PollGroupListParams extends PaginatedListParams {
    sort?: string;
}
export default class PollGroupListState<P extends PollGroupListParams = PollGroupListParams> extends PaginatedListState<PollGroup, P> {
    protected extraGroups: PollGroup[];
    protected eventEmitter: EventEmitter;
    constructor(params: P, page?: number);
    get type(): string;
    requestParams(): PaginatedListRequestParams;
    includes(): string[];
    private requestIncludes;
    protected loadPage(page?: number): Promise<ApiResponsePlural<PollGroup>>;
    clear(): void;
    /**
     * Get a map of sort keys (which appear in the URL, and are used for
     * translation) to the API sort value that they represent.
     */
    sortMap(): any;
    /**
     * In the last request, has the user searched for a poll group?
     */
    isSearchResults(): boolean;
    removePollGroup(pollGroup: PollGroup): void;
    deletePollGroup(pollGroup: PollGroup): void;
    /**
     * Add a poll group to the top of the list.
     */
    addPollGroup(pollGroup: PollGroup): void;
    protected getAllItems(): PollGroup[];
    getPages(): Page<PollGroup>[];
}
