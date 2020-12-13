import { extend } from 'flarum/extend';
import PermissionGrid from 'flarum/components/PermissionGrid';
import PollsSettingsModal from './PollsSettingsModal';

app.initializers.add('fof/polls', () => {
    app.extensionSettings['fof-polls'] = () => app.modal.show(PollsSettingsModal);

    extend(PermissionGrid.prototype, 'moderateItems', (items) => {
        items.add(
            'fof-polls',
            {
                icon: 'fa fa-pencil-alt',
                label: app.translator.trans('fof-polls.admin.permissions.moderate'),
                permission: 'discussion.polls',
            },
            95
        );
    });

    extend(PermissionGrid.prototype, 'startItems', (items) => {
        items.add(
            'fof-polls-start',
            {
                icon: 'fa fa-signal',
                label: app.translator.trans('fof-polls.admin.permissions.start'),
                permission: 'startPolls',
            },
            95
        );
    });

    extend(PermissionGrid.prototype, 'replyItems', (items) => {
        items.add(
            'fof-polls-edit',
            {
                icon: 'fa fa-pencil-alt',
                label: app.translator.trans('fof-polls.admin.permissions.self_edit'),
                permission: 'selfEditPolls',
            },
            70
        );
        items.add(
            'fof-polls-vote',
            {
                icon: 'fa fa-signal',
                label: app.translator.trans('fof-polls.admin.permissions.vote'),
                permission: 'votePolls',
            },
            80
        );
    });
});
