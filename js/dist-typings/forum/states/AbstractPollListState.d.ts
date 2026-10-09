import Model from 'flarum/common/Model';
import PaginatedListState, { PaginatedListParams, PaginatedListRequestParams } from 'flarum/common/states/PaginatedListState';
import EventEmitter from 'flarum/common/utils/EventEmitter';
import { ApiResponsePlural } from 'flarum/common/Store';
export interface PollListParams extends PaginatedListParams {
    sort?: string;
}
export declare const pollListEmitter: EventEmitter;
export default abstract class AbstractPollListState<M extends Model, P extends PollListParams = PollListParams> extends PaginatedListState<M, P> {
    constructor(params: P, page?: number);
    protected abstract deletedEvent(): string;
    protected abstract defaultSort(): string;
    abstract includes(): string[];
    getSort(): string;
    requestParams(): PaginatedListRequestParams;
    protected loadPage(page?: number): Promise<ApiResponsePlural<M>>;
    isSearchResults(): boolean;
    notifyDeleted(item: M): void;
    removeItem(item: M): void;
}
