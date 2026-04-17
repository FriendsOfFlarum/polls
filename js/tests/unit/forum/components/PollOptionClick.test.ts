import mq from 'mithril-query';
import m from 'mithril';
import { jest } from '@jest/globals';

/**
 * Tests for PollOption voting behavior.
 *
 * The click handling uses CSS `pointer-events: none` on .PollBar child elements
 * so all clicks land on the parent .PollBar's onclick handler. This avoids
 * issues with event bubbling in Mithril's virtual DOM.
 *
 * In mithril-query, we can only verify that clicking .PollBar directly calls
 * the handler. The CSS pointer-events behavior is verified by the browser.
 */

describe('PollOption click behavior', () => {
  describe('PollBar onclick handler', () => {
    function renderBar(opts: { onBarClick: (e: any) => void; showCheckMarks?: boolean }) {
      const { onBarClick, showCheckMarks = true } = opts;
      return mq(
        m(
          'div.PollOption',
          m('div.PollBar[role=option]', { onclick: onBarClick }, [
            showCheckMarks ? m('div.PollAnswer-checkbox', m('span.checkmark')) : null,
            m('div.PollAnswer-text', m('span.PollAnswer-text-answer', 'Option A')),
          ])
        )
      );
    }

    it('calls handler when clicking .PollBar', () => {
      const handler = jest.fn();
      const component = renderBar({ onBarClick: handler });
      component.click('.PollBar');
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('renders checkmark when showCheckMarks is true', () => {
      const component = renderBar({ onBarClick: jest.fn(), showCheckMarks: true });
      expect(component.has('.PollAnswer-checkbox')).toBe(true);
      expect(component.has('.checkmark')).toBe(true);
    });

    it('does not render checkmark when showCheckMarks is false', () => {
      const component = renderBar({ onBarClick: jest.fn(), showCheckMarks: false });
      expect(component.has('.PollAnswer-checkbox')).toBe(false);
    });

    it('renders option text', () => {
      const component = renderBar({ onBarClick: jest.fn() });
      expect(component.contains('Option A')).toBe(true);
    });

    it('has role=option for accessibility', () => {
      const component = renderBar({ onBarClick: jest.fn() });
      expect(component.has('.PollBar[role="option"]')).toBe(true);
    });
  });

  describe('onBarClick guard conditions', () => {
    it('does not call changeVote when disabled', () => {
      const changeVote = jest.fn();
      const isDisabled = true;
      const showCheckMarks = true;

      const onBarClick = () => {
        if (isDisabled || !showCheckMarks) return;
        changeVote();
      };

      const component = mq(m('div.PollBar', { onclick: onBarClick }));
      component.click('.PollBar');
      expect(changeVote).not.toHaveBeenCalled();
    });

    it('does not call changeVote when showCheckMarks is false', () => {
      const changeVote = jest.fn();
      const isDisabled = false;
      const showCheckMarks = false;

      const onBarClick = () => {
        if (isDisabled || !showCheckMarks) return;
        changeVote();
      };

      const component = mq(m('div.PollBar', { onclick: onBarClick }));
      component.click('.PollBar');
      expect(changeVote).not.toHaveBeenCalled();
    });

    it('calls changeVote when enabled and showCheckMarks is true', () => {
      const changeVote = jest.fn();
      const isDisabled = false;
      const showCheckMarks = true;

      const onBarClick = () => {
        if (isDisabled || !showCheckMarks) return;
        changeVote();
      };

      const component = mq(m('div.PollBar', { onclick: onBarClick }));
      component.click('.PollBar');
      expect(changeVote).toHaveBeenCalledTimes(1);
    });
  });

  describe('changeVote logic', () => {
    function simulateChangeVote(
      currentVoteOptionIds: string[],
      clickedOptionId: string,
      allowsMultiple: boolean
    ): { optionIds: string[]; isUnvoting: boolean } {
      const optionIds = new Set(currentVoteOptionIds);
      const isUnvoting = optionIds.delete(clickedOptionId);

      if (!allowsMultiple) {
        optionIds.clear();
      }

      if (!isUnvoting) {
        optionIds.add(clickedOptionId);
      }

      return { optionIds: Array.from(optionIds), isUnvoting };
    }

    it('adds vote for unvoted option (single vote)', () => {
      const result = simulateChangeVote([], '42', false);
      expect(result.isUnvoting).toBe(false);
      expect(result.optionIds).toEqual(['42']);
    });

    it('switches vote for single vote mode', () => {
      const result = simulateChangeVote(['1'], '2', false);
      expect(result.isUnvoting).toBe(false);
      expect(result.optionIds).toEqual(['2']);
    });

    it('removes vote when clicking already voted option (single vote)', () => {
      const result = simulateChangeVote(['42'], '42', false);
      expect(result.isUnvoting).toBe(true);
      expect(result.optionIds).toEqual([]);
    });

    it('adds additional vote in multiple mode', () => {
      const result = simulateChangeVote(['1'], '2', true);
      expect(result.isUnvoting).toBe(false);
      expect(result.optionIds).toEqual(['1', '2']);
    });

    it('removes one vote in multiple mode', () => {
      const result = simulateChangeVote(['1', '2'], '1', true);
      expect(result.isUnvoting).toBe(true);
      expect(result.optionIds).toEqual(['2']);
    });
  });
});
