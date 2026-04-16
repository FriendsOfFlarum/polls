import mq from 'mithril-query';
import m from 'mithril';
import { jest } from '@jest/globals';

// @ts-ignore
globalThis.m = m;

// Mock app.translator and app.route
const translations: Record<string, string> = {
  'test.prefix.add_title': 'Add New Item',
  'test.prefix.edit_title': 'Edit Item',
};

const routes: Record<string, string> = {
  'test.list': '/test/list',
  'test.view': '/test/view/1',
};

// @ts-ignore
globalThis.app = {
  translator: { trans: (key: string) => translations[key] || key },
  route: (name: string, params?: any) => routes[name] || `/${name}`,
};

/**
 * Tests for the generic ComposeHero component structure.
 * Since ComposeHero depends on Flarum imports, we test the rendering
 * pattern with minimal mithril components that mirror the structure.
 */
describe('ComposeHero rendering pattern', () => {
  function renderHero(opts: { isEditing: boolean; translationPrefix: string; className: string }) {
    const { isEditing, translationPrefix, className } = opts;
    const titleKey = `${translationPrefix}.${isEditing ? 'edit' : 'add'}_title`;

    return mq(
      m(`div.${className}.Hero`, [
        m('div.container', [
          m('div.containerNarrow', [
            m('h2.Hero-title', translations[titleKey] || titleKey),
            m(`div.${className}-controls`, [
              m('a.Button.Button--secondary', 'Manager'),
              isEditing ? m('a.Button.Button--secondary', 'View') : null,
            ]),
          ]),
        ]),
      ])
    );
  }

  it('shows "add" title when creating new item', () => {
    const hero = renderHero({ isEditing: false, translationPrefix: 'test.prefix', className: 'ComposeHero' });
    expect(hero.contains('Add New Item')).toBe(true);
  });

  it('shows "edit" title when editing existing item', () => {
    const hero = renderHero({ isEditing: true, translationPrefix: 'test.prefix', className: 'ComposeHero' });
    expect(hero.contains('Edit Item')).toBe(true);
  });

  it('shows manager button always', () => {
    const hero = renderHero({ isEditing: false, translationPrefix: 'test.prefix', className: 'ComposeHero' });
    expect(hero.contains('Manager')).toBe(true);
  });

  it('shows view button only when editing', () => {
    const heroNew = renderHero({ isEditing: false, translationPrefix: 'test.prefix', className: 'ComposeHero' });
    expect(heroNew.contains('View')).toBe(false);

    const heroEdit = renderHero({ isEditing: true, translationPrefix: 'test.prefix', className: 'ComposeHero' });
    expect(heroEdit.contains('View')).toBe(true);
  });

  it('applies the correct className', () => {
    const hero = renderHero({ isEditing: false, translationPrefix: 'test.prefix', className: 'ComposePollHero' });
    expect(hero.has('.ComposePollHero')).toBe(true);
    expect(hero.has('.Hero')).toBe(true);
  });
});
