import app from 'flarum/forum/app';
import PaginatedListState, { Page, PaginatedListParams, PaginatedListRequestParams } from 'flarum/common/states/PaginatedListState';
import Poll from '../models/Poll';
import { ApiResponsePlural } from 'flarum/common/Store';
import EventEmitter from 'flarum/common/utils/EventEmitter';

export interface PollListParams extends PaginatedListParams {
  sort?: string;
}

const globalEventEmitter = new EventEmitter();

export default class PollListState<P extends PollListParams = PollListParams> extends PaginatedListState<Poll, P> {
  protected extraPolls: Poll[] = [];
  protected eventEmitter: EventEmitter;

  constructor(params: P, page: number = 1) {
    super(params, page, 20);

    this.eventEmitter = globalEventEmitter.on('poll.deleted', this.deletePoll.bind(this));
  }

  get type(): string {
    return 'fof/polls';
  }

  requestParams(): PaginatedListRequestParams {
    const params = {
      include: ['options', 'votes'],
      filter: this.params.filter || {},
      sort: this.sortMap()[this.params.sort ?? ''],
    };

    if (this.params.q) {
      params.filter.q = this.params.q;
    }

    return params;
  }

  protected loadPage(page: number = 1): Promise<ApiResponsePlural<Poll>> {
    const preloadedPolls = app.preloadedApiDocument<Poll[]>();

    if (preloadedPolls) {
      this.initialLoading = false;

      return Promise.resolve(preloadedPolls);
    }

    return super.loadPage(page);
  }

  clear(): void {
    super.clear();

    this.extraPolls = [];
  }

  /**
   * Get a map of sort keys (which appear in the URL, and are used for
   * translation) to the API sort value that they represent.
   */
  sortMap() {
    const map: any = {};

    if (this.params.q) {
      map.relevance = '';
    }
    map.newest = '-createdAt';
    map.oldest = 'createdAt';

    return map;
  }

  /**
   * In the last request, has the user searched for a poll?
   */
  isSearchResults(): boolean {
    return !!this.params.q;
  }

  removePoll(poll: Poll): void {
    this.eventEmitter.emit('poll.deleted', poll);
  }

  deletePoll(poll: Poll): void {
    for (const page of this.pages) {
      const index = page.items.indexOf(poll);

      if (index !== -1) {
        page.items.splice(index, 1);
        break;
      }
    }

    const index = this.extraPolls.indexOf(poll);

    if (index !== -1) {
      this.extraPolls.splice(index);
    }

    m.redraw();
  }

  /**
   * Add a poll to the top of the list.
   */
  addPoll(poll: Poll): void {
    this.removePoll(poll);
    this.extraPolls.unshift(poll);

    m.redraw();
  }

  protected getAllItems(): Poll[] {
    return this.extraPolls.concat(super.getAllItems());
  }

  public getPages(): Page<Poll>[] {
    const pages = super.getPages();

    if (this.extraPolls.length) {
      return [
        {
          number: -1,
          items: this.extraPolls,
        },
        ...pages,
      ];
    }

    return pages;
  }
}
