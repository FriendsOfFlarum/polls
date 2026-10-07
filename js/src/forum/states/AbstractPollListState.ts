import app from 'flarum/forum/app';
import Model from 'flarum/common/Model';
import PaginatedListState, { PaginatedListParams, PaginatedListRequestParams } from 'flarum/common/states/PaginatedListState';
import EventEmitter from 'flarum/common/utils/EventEmitter';
import { ApiResponsePlural } from 'flarum/common/Store';

export interface PollListParams extends PaginatedListParams {
  sort?: string;
}

export const pollListEmitter = new EventEmitter();

export default abstract class AbstractPollListState<M extends Model, P extends PollListParams = PollListParams> extends PaginatedListState<M, P> {
  constructor(params: P, page: number = 1) {
    super(params, page);

    pollListEmitter.on(this.deletedEvent(), this.removeItem.bind(this));
  }

  protected abstract deletedEvent(): string;

  protected abstract defaultSort(): string;

  abstract includes(): string[];

  getSort(): string {
    return this.params.sort || this.defaultSort();
  }

  requestParams(): PaginatedListRequestParams {
    const params: PaginatedListRequestParams = {
      include: this.includes()
        .concat(this.params.include || [])
        .join(','),
      filter: this.params.filter || {},
      sort: this.currentSort(),
    };

    if (this.params.q) {
      params.filter!.q = this.params.q;
    }

    return params;
  }

  protected loadPage(page: number = 1): Promise<ApiResponsePlural<M>> {
    const preloaded = app.preloadedApiDocument<M[]>();

    if (preloaded) {
      this.initialLoading = false;
      this.pageSize = preloaded.payload?.meta?.perPage || PaginatedListState.DEFAULT_PAGE_SIZE;

      return Promise.resolve(preloaded);
    }

    return super.loadPage(page);
  }

  isSearchResults(): boolean {
    return !!this.params.q;
  }

  // Drops the record from every live list, not just this one.
  notifyDeleted(item: M): void {
    pollListEmitter.emit(this.deletedEvent(), item);
  }

  removeItem(item: M): void {
    for (const page of this.pages) {
      const index = page.items.indexOf(item);

      if (index !== -1) {
        page.items.splice(index, 1);
        break;
      }
    }

    m.redraw();
  }
}
