import fs from 'fs';
import path from 'path';
import jsYaml from 'js-yaml';
import flatten from 'flat';

import app from 'flarum/forum/app';
import ForumApplication from 'flarum/forum/ForumApplication';
import Drawer from 'flarum/common/utils/Drawer';

import extenders from '../src/forum/extend';

let booted = false;

export default function bootstrapForum(payload: Record<string, any> = {}): void {
  if (booted) {
    app.store.data = {};
    load(payload);
    app.store.pushPayload({ data: (app as any).data.resources });
    app.forum = app.store.getById('forums', '1')!;
    return;
  }

  (ForumApplication.prototype as any).mount = () => {};

  load(payload);

  extenders.forEach((extender: any) => extender.extend(app, { id: 'fof-polls', extra: {} }));
  app.boot();

  app.translator.setLocale('en');
  app.translator.addTranslations(readTranslations('../vendor/flarum/core/locale/core.yml'));
  app.translator.addTranslations(readTranslations('../resources/locale/en.yml'));
  (app as any).drawer = new Drawer();

  // mount() is what normally clears Mithril's default `#!` prefix, and the
  // test app never mounts.
  m.route.prefix = '';

  booted = true;
}

function load(payload: Record<string, any>): void {
  app.load({
    apiDocument: null,
    locale: 'en',
    locales: {},
    resources: [
      {
        type: 'forums',
        id: '1',
        attributes: {
          apiUrl: 'https://example.com/api',
          baseUrl: 'https://example.com',
          basePath: '',
          globalPollsEnabled: true,
          discussionPollsEnabled: true,
          pollMaxOptions: 10,
          pollsDirectoryDefaultSort: '-createdAt',
        },
      },
    ],
    session: { userId: 0, csrfToken: 'test' },
    ...payload,
  } as any);
}

function readTranslations(relative: string): Record<string, string> {
  return flatten(jsYaml.load(fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8')) as object) as Record<string, string>;
}
