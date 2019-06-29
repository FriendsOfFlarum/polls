import { extend } from 'flarum/extend';
import Discussion from 'flarum/models/Discussion';
import Badge from 'flarum/components/Badge';

export default function addPollBadge() {
    extend(Discussion.prototype, 'badges', function(badges) {
        if (this.Poll()) {
            badges.add(
                'poll',
                Badge.component({
                    type: 'poll',
                    label: app.translator.trans('reflar-polls.forum.tooltip.badge'),
                    icon: 'fa fa-signal',
                }),
                5
            );
        }
    });
}
