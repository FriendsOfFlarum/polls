import app from 'flarum/app';
import { extend, override } from 'flarum/extend';

import PermissionGrid from 'flarum/components/PermissionGrid';

app.initializers.add('reflar-polls', app => {
    extend(PermissionGrid.prototype, 'moderateItems', items => {
        items.add(
            'reflar-polls',
            {
                icon: 'fa fa-pencil-alt',
                label: app.translator.trans('reflar-polls.admin.permissions.moderate'),
                permission: 'discussion.polls',
            },
            95
        );
    });
    extend(PermissionGrid.prototype, 'startItems', items => {
        items.add(
            'reflar-polls-start',
            {
                icon: 'fa fa-signal',
                label: app.translator.trans('reflar-polls.admin.permissions.start'),
                permission: 'startPolls',
            },
            95
        );
    });
    extend(PermissionGrid.prototype, 'replyItems', items => {
        items.add(
            'reflar-polls-edit',
            {
                icon: 'fa fa-pencil-alt',
                label: app.translator.trans('reflar-polls.admin.permissions.self_edit'),
                permission: 'selfEditPolls',
            },
            70
        );
        items.add(
            'reflar-polls-vote',
            {
                icon: 'fa fa-signal',
                label: app.translator.trans('reflar-polls.admin.permissions.vote'),
                permission: 'votePolls',
            },
            80
        );
    });
});
