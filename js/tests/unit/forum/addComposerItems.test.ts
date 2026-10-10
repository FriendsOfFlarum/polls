import { describe, expect, test } from '@jest/globals';
import { focusEditorOnOpen } from '../../../src/forum/addComposerItems';

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
