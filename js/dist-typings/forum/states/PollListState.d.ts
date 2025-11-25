import PaginatedListState, { Page, PaginatedListParams, PaginatedListRequestParams } from 'flarum/common/states/PaginatedListState';
import Poll from '../models/Poll';
import { ApiResponsePlural } from 'flarum/common/Store';
import EventEmitter from 'flarum/common/utils/EventEmitter';
export interface PollListParams extends PaginatedListParams {
    sort?: string;
}
export default class PollListState<P extends PollListParams = PollListParams> extends PaginatedListState<Poll, P> {
    protected extraPolls: Poll[];
    protected eventEmitter: EventEmitter;
    constructor(params: P, page?: number);
    get type(): string;
    getSort(): string;
    setSort(sort: string): void;
    requestParams(): PaginatedListRequestParams;
    includes(): string[];
    private requestIncludes;
    protected loadPage(page?: number): Promise<ApiResponsePlural<Poll>>;
    clear(): void;
    /**
     * Get a map of sort keys (which appear in the URL, and are used for
     * translation) to the API sort value that they represent.
     */
    sortMap(): any;
    /**
     * In the last request, has the user searched for a poll?
     */
    isSearchResults(): boolean;
    removePoll(poll: Poll): void;
    deletePoll(poll: Poll): void;
    /**
     * Add a poll to the top of the list.
     */
    addPoll(poll: Poll): void;
    protected getAllItems(): Poll[];
    getPages(): Page<Poll>[];
}
