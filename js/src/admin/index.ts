import app from 'flarum/admin/app';
import PollsSettingsPage from './components/PollsSettingsPage';

export * from './components';

app.initializers.add('fof/polls', () => {
  app.extensionData
    .for('fof-polls')
    .registerPage(PollsSettingsPage)
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
