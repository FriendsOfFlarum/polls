import app from 'flarum/admin/app';

app.initializers.add('fof/polls', () => {
  app.extensionData
    .for('fof-polls')
    .registerSetting({
      setting: 'fof-polls.allowOptionImage',
      type: 'switch',
      label: app.translator.trans('fof-polls.admin.settings.allow_option_image'),
    })
    .registerSetting({
      setting: 'fof-polls.maxOptions',
      type: 'number',
      label: app.translator.trans('fof-polls.admin.settings.max_options'),
      min: 2,
    })
    .registerPermission(
      {
        icon: 'fas fa-signal',
        label: app.translator.trans('fof-polls.admin.permissions.view_results_without_voting'),
        permission: 'discussion.polls.viewResultsWithoutVoting',
        allowGuest: true,
      },
      'view'
    )
    .registerPermission(
      {
        icon: 'fas fa-signal',
        label: app.translator.trans('fof-polls.admin.permissions.start'),
        permission: 'discussion.polls.start',
      },
      'start'
    )
    .registerPermission(
      {
        icon: 'fas fa-pencil-alt',
        label: app.translator.trans('fof-polls.admin.permissions.self_edit'),
        permission: 'polls.selfEdit',
      },
      'start'
    )
    .registerPermission(
      {
        icon: 'fas fa-pencil-alt',
        label: app.translator.trans('fof-polls.admin.permissions.self_post_edit'),
        permission: 'polls.selfPostEdit',
      },
      'start'
    )
    .registerPermission(
      {
        icon: 'fas fa-signal',
        label: app.translator.trans('fof-polls.admin.permissions.vote'),
        permission: 'discussion.polls.vote',
      },
      'reply'
    )
    .registerPermission(
      {
        icon: 'fas fa-signal',
        label: app.translator.trans('fof-polls.admin.permissions.change_vote'),
        permission: 'polls.changeVote',
      },
      'reply'
    )
    .registerPermission(
      {
        icon: 'fas fa-pencil-alt',
        label: app.translator.trans('fof-polls.admin.permissions.moderate'),
        permission: 'discussion.polls.moderate',
      },
      'moderate'
    );
});
