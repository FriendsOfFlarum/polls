import app from 'flarum/admin/app';
import Extend from 'flarum/common/extenders';
import PollsSettingsPage from './components/PollsSettingsPage';

export default [
  new Extend.Admin()
    .page(PollsSettingsPage)
    .permission(
      () => ({
        icon: 'fas fa-poll',
        label: app.translator.trans('fof-polls.admin.permissions.view_results_without_voting'),
        permission: 'discussion.polls.viewResultsWithoutVoting',
        allowGuest: true,
      }),
      'view'
    )
    .permission(
      () => ({
        icon: 'fas fa-poll',
        label: app.translator.trans('fof-polls.admin.permissions.start'),
        permission: 'discussion.polls.start',
      }),
      'start'
    )
    .permission(
      () => ({
        icon: 'fas fa-poll',
        label: app.translator.trans('fof-polls.admin.permissions.start_global'),
        permission: 'startGlobalPoll',
      }),
      'start'
    )
    .permission(
      () => ({
        icon: 'fas fa-pencil-alt',
        label: app.translator.trans('fof-polls.admin.permissions.self_edit'),
        permission: 'polls.selfEdit',
      }),
      'start'
    )
    .permission(
      () => ({
        icon: 'fas fa-pencil-alt',
        label: app.translator.trans('fof-polls.admin.permissions.self_post_edit'),
        permission: 'polls.selfPostEdit',
      }),
      'start'
    )
    .permission(
      () => ({
        icon: 'fas fa-image',
        label: app.translator.trans('fof-polls.admin.permissions.upload_images'),
        permission: 'uploadPollImages',
      }),
      'start'
    )
    .permission(
      () => ({
        icon: 'fas fa-poll',
        label: app.translator.trans('fof-polls.admin.permissions.vote'),
        permission: 'discussion.polls.vote',
      }),
      'reply'
    )
    .permission(
      () => ({
        icon: 'fas fa-poll',
        label: app.translator.trans('fof-polls.admin.permissions.change_vote'),
        permission: 'polls.changeVote',
      }),
      'reply'
    )
    .permission(
      () => ({
        icon: 'fas fa-pencil-alt',
        label: app.translator.trans('fof-polls.admin.permissions.moderate'),
        permission: 'discussion.polls.moderate',
      }),
      'moderate'
    )
    .permission(
      () => ({
        icon: 'fas fa-poll',
        label: app.translator.trans('fof-polls.admin.permissions.view_group'),
        permission: 'viewPollGroups',
        allowGuest: true,
      }),
      'view'
    )
    .permission(
      () => ({
        icon: 'fas fa-plus',
        label: app.translator.trans('fof-polls.admin.permissions.start_group'),
        permission: 'startPollGroup',
      }),
      'start'
    )
    .permission(
      () => ({
        icon: 'fas fa-edit',
        label: app.translator.trans('fof-polls.admin.permissions.moderate_group'),
        permission: 'polls.moderate_group',
      }),
      'moderate'
    ),
];
