import mq from 'mithril-query';
import app from 'flarum/forum/app';
import { jest } from '@jest/globals';
import bootstrapForum from '../../../bootstrap';
import PollsPage from '../../../../src/forum/components/PollsPage';

beforeAll(() => bootstrapForum());

let routeSet: any;

beforeEach(() => {
  routeSet = jest.fn();
  m.route.set = routeSet as any;
  m.route.get = () => '/polls/all';
});

describe('PollsPage', () => {
  // The redirect is asynchronous, so the page still renders once afterwards.
  it('redirects instead of throwing when global polls are off', () => {
    app.forum.pushAttributes({ globalPollsEnabled: false });

    expect(() => mq(PollsPage, {})).not.toThrow();
    expect(routeSet).toHaveBeenCalledWith('/');

    app.forum.pushAttributes({ globalPollsEnabled: true });
  });

  it('offers a status filter and a sort, both as select dropdowns', () => {
    const out = mq(PollsPage, {});

    expect(out.find('.IndexPage-toolbar-view .Dropdown--select')).toHaveLength(2);
  });

  it('starts on the sort the forum is configured with', () => {
    app.forum.pushAttributes({ pollsDirectoryDefaultSort: 'createdAt' });

    const out = mq(PollsPage, {});

    expect(out.rootEl.querySelector('.item-sort .Dropdown-toggle .Button-labelText')!.textContent).toBe('Oldest');

    app.forum.pushAttributes({ pollsDirectoryDefaultSort: '-createdAt' });
  });
});
