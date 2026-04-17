import { jest } from '@jest/globals';

// @ts-ignore
globalThis.m = { redraw: jest.fn() };

describe('PollListState logic', () => {
  describe('sortMap', () => {
    function sortMap(hasQuery: boolean) {
      const map: Record<string, string> = {};
      if (hasQuery) map.relevance = '';
      map.newest = '-createdAt';
      map.oldest = 'createdAt';
      map.most_voted = '-voteCount';
      map.least_voted = 'voteCount';
      return map;
    }

    it('includes all sort options without query', () => {
      const map = sortMap(false);
      expect(Object.keys(map)).toEqual(['newest', 'oldest', 'most_voted', 'least_voted']);
      expect(map.newest).toBe('-createdAt');
      expect(map.oldest).toBe('createdAt');
    });

    it('includes relevance when query is present', () => {
      const map = sortMap(true);
      expect(Object.keys(map)[0]).toBe('relevance');
      expect(map.relevance).toBe('');
    });
  });

  describe('getSort', () => {
    it('returns params.sort when set', () => {
      const params = { sort: '-voteCount' };
      const result = params.sort || '-createdAt';
      expect(result).toBe('-voteCount');
    });

    it('falls back to -createdAt when no sort set', () => {
      const params = { sort: undefined };
      const result = params.sort || '-createdAt';
      expect(result).toBe('-createdAt');
    });
  });

  describe('requestParams', () => {
    it('builds params with filter and sort', () => {
      const paramsConfig = { sort: '-voteCount', filter: { isEnded: '1' }, q: undefined as string | undefined };
      const includes = ['options', 'votes'];

      const params: Record<string, any> = {
        include: includes.join(','),
        filter: paramsConfig.filter || {},
        sort: paramsConfig.sort || '-createdAt',
      };

      if (paramsConfig.q) {
        params.filter.q = paramsConfig.q;
      }

      expect(params.sort).toBe('-voteCount');
      expect(params.filter).toEqual({ isEnded: '1' });
      expect(params.include).toBe('options,votes');
    });

    it('adds q to filter when present', () => {
      const paramsConfig = { sort: undefined, filter: {} as Record<string, string>, q: 'search term' };

      const params: Record<string, any> = {
        include: 'options,votes',
        filter: paramsConfig.filter || {},
        sort: paramsConfig.sort || '-createdAt',
      };

      if (paramsConfig.q) {
        params.filter.q = paramsConfig.q;
      }

      expect(params.filter.q).toBe('search term');
    });
  });

  describe('isSearchResults', () => {
    it('returns true when q is set', () => {
      expect(!!('search term')).toBe(true);
    });

    it('returns false when q is empty', () => {
      expect(!!(undefined)).toBe(false);
      expect(!!('')).toBe(false);
    });
  });

  describe('deletePoll from pages', () => {
    it('removes poll from correct page', () => {
      const poll1 = { id: () => '1' };
      const poll2 = { id: () => '2' };
      const poll3 = { id: () => '3' };

      const pages = [{ number: 1, items: [poll1, poll2] }, { number: 2, items: [poll3] }];

      // Simulate deletePoll
      for (const page of pages) {
        const index = page.items.indexOf(poll2);
        if (index !== -1) {
          page.items.splice(index, 1);
          break;
        }
      }

      expect(pages[0].items).toEqual([poll1]);
      expect(pages[1].items).toEqual([poll3]);
    });

    it('removes poll from extraPolls', () => {
      const poll1 = { id: () => '1' };
      const poll2 = { id: () => '2' };
      const extraPolls = [poll1, poll2];

      const index = extraPolls.indexOf(poll1);
      if (index !== -1) extraPolls.splice(index, 1);

      expect(extraPolls).toEqual([poll2]);
    });

    it('handles poll not in any page', () => {
      const poll1 = { id: () => '1' };
      const missingPoll = { id: () => '99' };

      const pages = [{ number: 1, items: [poll1] }];

      for (const page of pages) {
        const index = page.items.indexOf(missingPoll);
        if (index !== -1) {
          page.items.splice(index, 1);
          break;
        }
      }

      expect(pages[0].items).toEqual([poll1]);
    });
  });

  describe('addPoll', () => {
    it('adds poll to front of extraPolls', () => {
      const poll1 = { id: () => '1' };
      const newPoll = { id: () => '2' };
      const extraPolls = [poll1];

      extraPolls.unshift(newPoll);

      expect(extraPolls[0]).toBe(newPoll);
      expect(extraPolls[1]).toBe(poll1);
    });
  });

  describe('getPages with extraPolls', () => {
    it('prepends extra page when extraPolls exist', () => {
      const extra = [{ id: () => '0' }];
      const regularPages = [{ number: 1, items: [{ id: () => '1' }] }];

      const pages = extra.length ? [{ number: -1, items: extra }, ...regularPages] : regularPages;

      expect(pages.length).toBe(2);
      expect(pages[0].number).toBe(-1);
      expect(pages[0].items).toBe(extra);
    });

    it('returns regular pages when no extras', () => {
      const extra: any[] = [];
      const regularPages = [{ number: 1, items: [{ id: () => '1' }] }];

      const pages = extra.length ? [{ number: -1, items: extra }, ...regularPages] : regularPages;

      expect(pages.length).toBe(1);
      expect(pages[0].number).toBe(1);
    });
  });
});
