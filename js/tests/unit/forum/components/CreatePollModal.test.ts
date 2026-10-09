import mq from 'mithril-query';
import bootstrapForum from '../../../bootstrap';
import CreatePollModal from '../../../../src/forum/components/CreatePollModal';
import EditPollModal from '../../../../src/forum/components/EditPollModal';
import PollFormState from '../../../../src/forum/states/PollFormState';

beforeAll(() => bootstrapForum());

function render(Modal: any) {
  return mq(Modal, { poll: PollFormState.createNewPoll(), onsubmit: async () => {}, animateShow: () => {}, state: {} });
}

describe('CreatePollModal', () => {
  it('leaves PollForm as the only form on the page', () => {
    expect(render(CreatePollModal).rootEl.querySelectorAll('form')).toHaveLength(1);
  });

  it('titles itself for creating a poll', () => {
    expect(render(CreatePollModal).rootEl.textContent).toContain('Add a Poll');
  });

  it('titles itself for editing when used to edit', () => {
    expect(render(EditPollModal).rootEl.textContent).toContain('Edit Poll');
  });
});
