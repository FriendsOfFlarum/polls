import app from 'flarum/forum/app';

import { extend } from 'flarum/common/extend';
import Badge from 'flarum/common/components/Badge';
import extractText from 'flarum/common/utils/extractText';
import DiscussionList from 'flarum/forum/components/DiscussionList';
import Discussion from 'flarum/common/models/Discussion';
import { PaginatedListRequestParams } from 'flarum/common/states/PaginatedListState';

export default () => {
  // @ts-ignore
  extend(DiscussionList.prototype, 'requestParams', (params: PaginatedListRequestParams) => {
    (params.include as string[]).push('poll');
  });

  extend(Discussion.prototype, 'badges', function (badges) {
    // @ts-ignore
    if (this.hasPoll()) {
      badges.add('poll', <Badge type="poll" icon="fas fa-poll" label={extractText(app.translator.trans('fof-polls.forum.tooltip.badge'))} />, 5);
    }
  });
};
