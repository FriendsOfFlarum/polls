import { extend } from 'flarum/common/extend';
import Badge from 'flarum/common/components/Badge';
import DiscussionList from 'flarum/forum/components/DiscussionList';
import Discussion from 'flarum/common/models/Discussion';

export default () => {
    extend(DiscussionList.prototype, 'requestParams', (params) => {
        params.include.push('poll');
    });

    extend(Discussion.prototype, 'badges', function (badges) {
        if (this.poll()) {
            badges.add(
                'poll',
                Badge.component({
                    type: 'poll',
                    label: app.translator.trans('fof-polls.forum.tooltip.badge'),
                    icon: 'fa fa-signal',
                }),
                5
            );
        }
    });
};
