import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import LinkButton from 'flarum/common/components/LinkButton';

export default function addNavItem() {
  extend(IndexPage.prototype, 'navItems', (items) => {
    if (!app.forum.attribute<boolean>('globalPollsEnabled')) {
      return;
    }

    items.add(
      'fof-polls-showcase',
      LinkButton.component(
        {
          href: app.route('fof.polls.showcase'),
          icon: 'fas fa-poll',
        },
        app.translator.trans('fof-polls.forum.page.nav')
      ),
      35
    );

    const showAllGlobalPolls = app.forum.attribute<boolean>('canStartGlobalPolls');

    if (showAllGlobalPolls) {
      items.add(
        'fof-polls-list',
        LinkButton.component(
          {
            href: app.route('fof.polls.list'),
            icon: 'fas fa-list',
          },
          app.translator.trans('fof-polls.forum.page.nav-all')
        ),
        32
      );
    }

    if (app.forum.attribute<boolean>('pollGroupsEnabled')) {
      items.add(
        'fof-poll-groups-list',
        LinkButton.component(
          {
            href: app.route('fof.polls.groups.list'),
            icon: 'fas fa-layer-group',
          },
          app.translator.trans('fof-polls.forum.page.nav-groups')
        ),
        30
      );
    }
  });
}
