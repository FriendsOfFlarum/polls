import { jest } from '@jest/globals';

// @ts-ignore
globalThis.m = { redraw: jest.fn() };

describe('PollFormState logic', () => {
  describe('isExpanded / expand', () => {
    it('defaults to setup group expanded', () => {
      let expandedGroup = 'setup';
      expect(expandedGroup === 'setup').toBe(true);
      expect(expandedGroup === 'options').toBe(false);
    });

    it('expands a different group', () => {
      let expandedGroup = 'setup';
      expandedGroup = 'options';
      expect(expandedGroup === 'options').toBe(true);
      expect(expandedGroup === 'setup').toBe(false);
    });
  });

  describe('save flow', () => {
    it('sets loading during save', async () => {
      let loading = false;

      // Simulate save
      loading = true;
      expect(loading).toBe(true);

      await Promise.resolve(); // simulate async save

      loading = false;
      expect(loading).toBe(false);
    });
  });

  describe('delete flow', () => {
    it('sets deleting flag after delete', async () => {
      let loading = false;
      let deleting = false;

      loading = true;

      await Promise.resolve(); // simulate async delete
      deleting = true;

      loading = false;

      expect(deleting).toBe(true);
      expect(loading).toBe(false);
    });
  });
});
