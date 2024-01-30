import app from 'flarum/forum/app';

/**
 * Based on Flarum's DiscussionListState
 */
import SortMap from '../../common/utils/SortMap';

export default class UserDirectoryState {
  constructor(params = {}, app = window.app) {
    this.params = params;

    this.app = app;

    this.users = [];

    this.moreResults = false;

    this.loading = false;

    this.qBuilder = {};
  }

  requestParams() {
    const params = { include: [], filter: {} };

    const sortKey = this.params.sort || app.forum.attribute('userDirectoryDefaultSort');

    // sort might be set to null if no sort params has been passed
    params.sort = this.sortMap()[sortKey];

    if (this.params.q) {
      params.filter.q = this.params.q;
    }

    return params;
  }

  sortMap() {
    return {
      default: '',
      ...new SortMap().sortMap(),
    };
  }

  getParams() {
    return this.params;
  }

  clear() {
    this.users = [];
    m.redraw();
  }

  refreshParams(newParams) {
    if (!this.hasUsers() || Object.keys(newParams).some((key) => this.getParams()[key] !== newParams[key])) {
      const q = '';
      this.params = newParams;

      if (newParams.qBuilder) {
        Object.assign(this.qBuilder, newParams.qBuilder || {});
        this.params.q = Object.values(this.qBuilder).join(' ').trim();
      }

      if (!this.params.q && q) {
        this.params.q = q;
      }

      this.refresh();
    }
  }

  refresh() {
    this.loading = true;

    this.clear();

    return this.loadResults().then(
      (results) => {
        this.users = [];
        this.parseResults(results);
      },
      () => {
        this.loading = false;
        m.redraw();
      }
    );
  }

  loadResults(offset) {
    const preloadedUsers = this.app.preloadedApiDocument();

    if (preloadedUsers) {
      return Promise.resolve(preloadedUsers);
    }

    const params = this.requestParams();
    params.page = { offset };
    params.include = params.include.join(',');

    return this.app.store.find('users', params);
  }

  loadMore() {
    this.loading = true;

    this.loadResults(this.users.length).then(this.parseResults.bind(this));
  }

  parseResults(results) {
    this.users.push(...results);

    this.loading = false;
    this.moreResults = !!results.payload.links && !!results.payload.links.next;

    m.redraw();

    return results;
  }

  hasUsers() {
    return this.users.length > 0;
  }

  isLoading() {
    return this.loading;
  }

  isSearchResults() {
    return !!this.params.q;
  }

  empty() {
    return !this.hasUsers() && !this.isLoading();
  }
}
