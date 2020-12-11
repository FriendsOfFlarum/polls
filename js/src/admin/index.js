import app from 'flarum/app';

app.initializers.add('fof/polls', () => {
    app.extensionData
        .for('fof-polls')
        .registerPermission(
            {
                icon: 'fa fa-pencil-alt',
                label: app.translator.trans('fof-polls.admin.permissions.moderate'),
                permission: 'discussion.polls',
            },
            'moderate'
        )
        .registerPermission(
            {
                icon: 'fa fa-signal',
                label: app.translator.trans('fof-polls.admin.permissions.start'),
                permission: 'startPolls',
            },
            'start'
        )
        .registerPermission(
            {
                icon: 'fa fa-pencil-alt',
                label: app.translator.trans('fof-polls.admin.permissions.self_edit'),
                permission: 'selfEditPolls',
            },
            'reply'
        )
        .registerPermission(
            {
                icon: 'fa fa-signal',
                label: app.translator.trans('fof-polls.admin.permissions.vote'),
                permission: 'votePolls',
            },
            'reply'
        );
});
