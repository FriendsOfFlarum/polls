import { describe, expect, test, beforeAll } from '@jest/globals';
import app from 'flarum/forum/app';
import ReplyComposer from 'flarum/forum/components/ReplyComposer';
import DiscussionComposer from 'flarum/forum/components/DiscussionComposer';
import bootstrapForum from '../../bootstrap';
import addComposerItems, { focusEditorOnOpen } from '../../../src/forum/addComposerItems';

beforeAll(() => {
  bootstrapForum();
  // The forum bundle registers core's modules; the test app has to do it by hand
  // for the extensions by module name to land.
  flarum.reg.add('core', 'forum/components/ReplyComposer', ReplyComposer);
  flarum.reg.add('core', 'forum/components/DiscussionComposer', DiscussionComposer);
  addComposerItems();
});

function headerKeys(ComposerClass: any): string[] {
  const discussion = app.store.createRecord('discussions', {
    id: '1',
    attributes: { title: 'A discussion', slug: '1-a-discussion', canStartPoll: true },
  });
  const composer = new ComposerClass();
  composer.attrs = { discussion, composer: { fields: {} } };
  composer.composer = { fields: {}, body: { attrs: { discussion } } };

  return composer
    .headerItems()
    .toArray()
    .map((item: any) => item.itemName);
}

describe('poll button in the composer header', () => {
  // Phones lift the first header item into the top bar, so in a reply the
  // discussion title has to stay first.
  test('comes after the discussion title in a reply', () => {
    const keys = headerKeys(ReplyComposer);

    expect(keys).toContain('polls');
    expect(keys[0]).toBe('title');
  });

  test('keeps its place in a new discussion', () => {
    const keys = headerKeys(DiscussionComposer);

    expect(keys.indexOf('polls')).toBeGreaterThan(keys.indexOf('title'));
  });
});

describe('focusEditorOnOpen', () => {
  test('points the composer focus at the text editor', () => {
    const composerBody = { focusOnSelector: null as null | (() => string) };

    focusEditorOnOpen(composerBody);

    expect(composerBody.focusOnSelector?.()).toBe('.TextEditor-editor');
  });

  test('keeps a selector that is already set', () => {
    const own = () => '.Custom-field';
    const composerBody = { focusOnSelector: own as null | (() => string) };

    focusEditorOnOpen(composerBody);

    expect(composerBody.focusOnSelector).toBe(own);
  });
});
