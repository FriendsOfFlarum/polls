import app from 'flarum/forum/app';
import PaginatedListState, { Page, PaginatedListParams, PaginatedListRequestParams } from 'flarum/common/states/PaginatedListState';
import EventEmitter from 'flarum/common/utils/EventEmitter';
import { ApiResponsePlural } from 'flarum/common/Store';
import PollGroup from '../models/PollGroup';

export interface PollGroupListParams extends PaginatedListParams {
  sort?: string;
}

const globalEventEmitter = new EventEmitter();

export default class PollGroupListState<P extends PollGroupListParams = PollGroupListParams> extends PaginatedListState<PollGroup, P> {
  protected extraGroups: PollGroup[] = [];
  protected eventEmitter: EventEmitter;

  constructor(params: P, page: number = 1) {
    super(params, page, 20);

    this.eventEmitter = globalEventEmitter.on('pollgroup.deleted', this.deletePollGroup.bind(this));
  }

  get type(): string {
    return '/fof/polls/groups';
  }

  requestParams(): PaginatedListRequestParams {
    const params = {
      include: this.requestIncludes(),
      filter: this.params.filter || {},
      sort: this.sortMap()[this.params.sort ?? ''],
    };

    if (this.params.q) {
      params.filter.q = this.params.q;
    }

    return params;
  }

  includes(): string[] {
    return ['polls', 'user'];
  }

  private requestIncludes(): string {
    const standard = this.includes();

    // merge the standard includes with the custom includes
    const merged = [...standard, ...(this.params.include || [])];

    // return as a comma separated string
    return merged.join(',');
  }

  protected loadPage(page: number = 1): Promise<ApiResponsePlural<PollGroup>> {
    const preloadedGroups = app.preloadedApiDocument<PollGroup[]>();

    if (preloadedGroups) {
      this.initialLoading = false;

      return Promise.resolve(preloadedGroups);
    }

    return super.loadPage(page);
  }

  clear(): void {
    super.clear();

    this.extraGroups = [];
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
   * In the last request, has the user searched for a poll group?
   */
  isSearchResults(): boolean {
    return !!this.params.q;
  }

  removePollGroup(pollGroup: PollGroup): void {
    this.eventEmitter.emit('pollgroup.deleted', pollGroup);
  }

  deletePollGroup(pollGroup: PollGroup): void {
    for (const page of this.pages) {
      const index = page.items.indexOf(pollGroup);

      if (index !== -1) {
        page.items.splice(index, 1);
        break;
      }
    }

    const index = this.extraGroups.indexOf(pollGroup);

    if (index !== -1) {
      this.extraGroups.splice(index);
    }

    m.redraw();
  }

  /**
   * Add a poll group to the top of the list.
   */
  addPollGroup(pollGroup: PollGroup): void {
    this.removePollGroup(pollGroup);
    this.extraGroups.unshift(pollGroup);

    m.redraw();
  }

  protected getAllItems(): PollGroup[] {
    return this.extraGroups.concat(super.getAllItems());
  }

  public getPages(): Page<PollGroup>[] {
    const pages = super.getPages();

    if (this.extraGroups.length) {
      return [
        {
          number: -1,
          items: this.extraGroups,
        },
        ...pages,
      ];
    }

    return pages;
  }
}
