import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import LinkButton from 'flarum/common/components/LinkButton';

import app from 'flarum/forum/app';

export default function () {
  extend(IndexPage.prototype, 'navItems', function (items) {
    items.add(
      'polls',
      <LinkButton icon="fas fa-poll" href={app.route('polls')}>
        Polls
      </LinkButton>,
      -11
    );
  });
}
