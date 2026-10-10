import mq from 'mithril-query';
import app from 'flarum/forum/app';
import bootstrapForum from '../../../bootstrap';
import PollForm from '../../../../src/forum/components/Poll/PollForm';
import PollFormState from '../../../../src/forum/states/PollFormState';
import { makePoll } from '../../../factory';

beforeAll(() => bootstrapForum());

function render(attrs: Record<string, unknown> = {}) {
  return mq(PollForm, { poll: PollFormState.createNewPoll(), onsubmit: async () => {}, ...attrs });
}

function labelFor(root: Element, selector: string): string | null {
  const input = root.querySelector(selector)!;
  const label = root.querySelector(`label[for="${input.id}"]`);

  return label && label.textContent;
}

describe('PollForm', () => {
  it('owns exactly one form element', () => {
    expect(render().rootEl.querySelectorAll('form')).toHaveLength(1);
  });

  it('ties each label to its own input', () => {
    const root = render().rootEl;

    expect(labelFor(root, 'input[name=question]')).toBe('Question');
    expect(labelFor(root, 'input[name=subtitle]')).toBe('Subtitle/Description (optional)');
    expect(labelFor(root, 'input[name=answer1]')).toBe('Answer 1');
    expect(labelFor(root, 'input[name=date]')).toBe('Poll end date (Optional)');
  });

  it('starts with the two answer rows a poll needs', () => {
    const out = render();

    expect(out.find('.PollForm-answer')).toHaveLength(2);
    expect(out).not.toHaveElement('.PollForm-removeAnswer');
  });

  it('adds an answer row, which can then be removed', () => {
    const out = render();

    out.click('.PollForm-addAnswer');
    out.redraw();

    expect(out.find('.PollForm-answer')).toHaveLength(3);
    expect(out.find('.PollForm-removeAnswer')).toHaveLength(1);
  });

  it('refuses to add more answers than the forum allows', () => {
    app.forum.pushAttributes({ pollMaxOptions: 2 });

    const out = render();

    out.click('.PollForm-addAnswer');
    out.redraw();

    expect(out.find('.PollForm-answer')).toHaveLength(2);

    app.forum.pushAttributes({ pollMaxOptions: 10 });
  });

  it('renders the vote settings as switches', () => {
    const out = render();

    expect(out.find('.FieldSet .Checkbox--switch').length).toBeGreaterThanOrEqual(4);
  });

  it('only asks for a vote cap once several votes are allowed', () => {
    const out = render();

    expect(out).not.toHaveElement('input[name=maxVotes]');

    const input = out.rootEl.querySelector('.PollForm-setting--allowMultipleVotes input') as HTMLInputElement;
    input.checked = true;
    out.trigger('.PollForm-setting--allowMultipleVotes input', 'change', undefined);

    expect(out).toHaveElement('input[name=maxVotes]');
  });

  it('leaves the end date empty for a poll that has none', () => {
    const out = render();

    expect((out.rootEl.querySelector('input[name=date]') as HTMLInputElement).value).toBe('');
  });

  it('leaves the end date empty for a saved poll whose end date is null', () => {
    const poll = makePoll({ endDate: null });

    const out = render({ poll });

    expect((out.rootEl.querySelector('input[name=date]') as HTMLInputElement).value).toBe('');
  });

  it('labels the per-answer image upload', () => {
    const out = render();

    expect(out.rootEl.querySelector('.PollForm-answerImage .FieldSet-label')!.textContent).toBe('Poll Answer Image');
  });

  it('shows an existing end date in the picker', () => {
    const poll = PollFormState.createNewPoll();
    poll.pushAttributes({ endDate: '2099-01-02T03:04:00+00:00' });

    const out = render({ poll });

    expect((out.rootEl.querySelector('input[name=date]') as HTMLInputElement).value).toBe(
      dayjs('2099-01-02T03:04:00+00:00').format('YYYY-MM-DDTHH:mm')
    );
  });

  it('offers a plain save button when drafts are not on the table', () => {
    const out = render();

    expect(out).toHaveElement('.PollForm-save');
    expect(out).not.toHaveElement('.PollForm-saveDraft');
  });

  it('offers draft, publish and schedule when drafts are allowed', () => {
    const out = render({ allowDrafts: true });

    expect(out).toHaveElement('.PollForm-saveDraft');
    expect(out).toHaveElement('.PollForm-publish');
    expect(out).not.toHaveElement('.PollForm-save');
  });
});
