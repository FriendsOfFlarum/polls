import app from 'flarum/forum/app';

import { extend } from 'flarum/common/extend';
import Badge from 'flarum/common/components/Badge';
import DiscussionList from 'flarum/forum/components/DiscussionList';
import Discussion from 'flarum/common/models/Discussion';

export default () => {
  extend(DiscussionList.prototype, 'requestParams', (params) => {
    params.include.push('poll');
  });

  extend(Discussion.prototype, 'badges', function (badges) {
    if (this.hasPoll()) {
      badges.add(
        'poll',
        Badge.component({
          type: 'poll',
          label: app.translator.trans('fof-polls.forum.tooltip.badge'),
          icon: 'fas fa-signal',
        }),
        5
      );
    }
  });
};
