import Extend from 'flarum/common/extenders';
import Post from 'flarum/common/models/Post';
import Forum from 'flarum/common/models/Forum';
import Discussion from 'flarum/common/models/Discussion';
import Poll from './models/Poll';
import PollOption from './models/PollOption';
import PollVote from './models/PollVote';
import PollGroup from './models/PollGroup';

export default [
  new Extend.Routes() //
    .add('fof.polls.showcase', '/polls', () => import('./components/PollsShowcasePage'))
    .add('fof.polls.list', '/polls/all', () => import('./components/PollsPage'))
    .add('fof.polls.view', '/polls/view/:id', () => import('./components/PollViewPage'))
    .add('fof.polls.composer', '/polls/composer', () => import('./components/ComposePollPage'))
    .add('fof.polls.groups.composer', '/polls/groups/composer', () => import('./components/ComposePollGroupPage'))
    .add('fof.polls.groups.list', '/polls/groups', () => import('./components/PollGroupListPage'))
    .add('fof.polls.groups.view', '/polls/groups/:id', () => import('./components/PollGroupViewPage')),

  new Extend.Store() //
    .add('polls', Poll)
    .add('poll_options', PollOption)
    .add('poll_votes', PollVote)
    .add('poll_groups', PollGroup),

  new Extend.Model(Post) //
    .hasMany<Poll>('polls')
    .attribute<boolean>('canStartPoll'),

  new Extend.Model(Forum) //
    .attribute<boolean>('canStartPolls'),

  new Extend.Model(Discussion) //
    .attribute<boolean>('hasPoll')
    .attribute<boolean>('canStartPoll'),
];
