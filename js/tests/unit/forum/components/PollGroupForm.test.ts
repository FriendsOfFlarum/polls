import mq from 'mithril-query';
import app from 'flarum/forum/app';
import extractText from 'flarum/common/utils/extractText';
import bootstrapForum from '../../../bootstrap';
import PollGroupForm from '../../../../src/forum/components/PollGroup/PollGroupForm';
import PollGroupFormState from '../../../../src/forum/states/PollGroupFormState';

beforeAll(() => bootstrapForum());

function render() {
  return mq(PollGroupForm, { pollGroup: PollGroupFormState.createNewPollGroup(), onsubmit: async () => {} });
}

describe('PollGroupForm', () => {
  it('takes its name label from the locale file', () => {
    const root = render().rootEl;
    const input = root.querySelector('input[name=name]')!;

    expect(root.querySelector(`label[for="${input.id}"]`)!.textContent).toBe('Name');
    expect(extractText(app.translator.trans('fof-polls.forum.poll_groups.composer.name_required'))).toBe('A poll group needs a name.');
    expect(extractText(app.translator.trans('fof-polls.forum.poll_groups.composer.error'))).toContain('poll group');
  });

  it('offers no delete button before the group exists', () => {
    const out = render();

    expect(out).toHaveElement('button[type=submit]');
    expect(out.find('.PollGroupForm-submit button')).toHaveLength(1);
  });
});
