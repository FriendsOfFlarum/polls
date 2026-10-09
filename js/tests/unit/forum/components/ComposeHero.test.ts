import mq from 'mithril-query';
import app from 'flarum/forum/app';
import bootstrapForum from '../../../bootstrap';
import { makePoll } from '../../../factory';
import ComposeHero from '../../../../src/forum/components/ComposeHero';
import PollFormState from '../../../../src/forum/states/PollFormState';

beforeAll(() => bootstrapForum());

function render(item: any) {
  return mq(ComposeHero, {
    item,
    className: 'ComposePollHero',
    translationPrefix: 'fof-polls.forum.compose',
    managerRoute: 'fof.polls.list',
    managerIcon: 'far fa-edit',
    managerLabel: app.translator.trans('fof-polls.forum.compose.polls_manager'),
    viewRoute: 'fof.polls.view',
    viewIcon: 'far fa-arrow-up-right-from-square',
    viewLabel: app.translator.trans('fof-polls.forum.compose.polls_preview'),
  });
}

describe('ComposeHero', () => {
  // Core's Hero owns the <header>/container scaffolding; this used to be
  // hand-built out of divs.
  it('is a core Hero', () => {
    const out = render(PollFormState.createNewPoll());

    expect(out).toHaveElement('header.Hero.ComposePollHero .container');
  });

  it('says "add" for a poll that does not exist yet', () => {
    expect(render(PollFormState.createNewPoll()).rootEl.querySelector('.Hero-title')!.textContent).toBe('Add a Poll');
  });

  it('says "edit" for a saved poll', () => {
    expect(render(makePoll()).rootEl.querySelector('.Hero-title')!.textContent).toBe('Edit Poll');
  });

  it('links to the manager always, and to the poll only once it exists', () => {
    expect(render(PollFormState.createNewPoll()).find('.ComposeHero-controls a')).toHaveLength(1);
    expect(render(makePoll()).find('.ComposeHero-controls a')).toHaveLength(2);
  });
});
