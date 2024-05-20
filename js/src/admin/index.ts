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
      setting: 'fof-polls.optionsColorBlend',
      type: 'switch',
      label: app.translator.trans('fof-polls.admin.settings.options_color_blend'),
      help: app.translator.trans('fof-polls.admin.settings.options_color_blend_help'),
    })
    .registerSetting({
      setting: 'fof-polls.maxOptions',
      type: 'number',
      label: app.translator.trans('fof-polls.admin.settings.max_options'),
      min: 2,
    })
    .registerSetting({
      setting: 'fof-polls.allowImageUploads',
      type: 'switch',
      label: app.translator.trans('fof-polls.admin.settings.allow_image_uploads'),
      help: app.translator.trans('fof-polls.admin.settings.allow_image_uploads_help'),
    })
    .registerSetting({
      setting: 'fof-polls.enableGlobalPolls',
      type: 'boolean',
      label: app.translator.trans('fof-polls.admin.settings.enable_global_polls'),
      help: app.translator.trans('fof-polls.admin.settings.enable_global_polls_help'),
    })
    .registerSetting({
      setting: 'fof-polls.image_height',
      type: 'number',
      label: app.translator.trans('fof-polls.admin.settings.image_height'),
    })
    .registerSetting({
      setting: 'fof-polls.image_width',
      type: 'number',
      label: app.translator.trans('fof-polls.admin.settings.image_width'),
    })
    .registerPermission(
      {
        icon: 'fas fa-poll',
        label: app.translator.trans('fof-polls.admin.permissions.view_results_without_voting'),
        permission: 'discussion.polls.viewResultsWithoutVoting',
        allowGuest: true,
      },
      'view'
    )
    .registerPermission(
      {
        icon: 'fas fa-poll',
        label: app.translator.trans('fof-polls.admin.permissions.start'),
        permission: 'discussion.polls.start',
      },
      'start'
    )
    .registerPermission(
      {
        icon: 'fas fa-poll',
        label: app.translator.trans('fof-polls.admin.permissions.start_global'),
        permission: 'startGlobalPoll',
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
        icon: 'fas fa-image',
        label: app.translator.trans('fof-polls.admin.permissions.upload_images'),
        permission: 'uploadPollImages',
      },
      'start'
    )
    .registerPermission(
      {
        icon: 'fas fa-poll',
        label: app.translator.trans('fof-polls.admin.permissions.vote'),
        permission: 'discussion.polls.vote',
      },
      'reply'
    )
    .registerPermission(
      {
        icon: 'fas fa-poll',
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
