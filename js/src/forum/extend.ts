import Extend from 'flarum/common/extenders';
import Post from 'flarum/common/models/Post';
import Forum from 'flarum/common/models/Forum';
import Discussion from 'flarum/common/models/Discussion';
import Poll from './models/Poll';
import PollOption from './models/PollOption';
import PollVote from './models/PollVote';
import PollsPage from './components/PollsPage';
import ComposePollPage from './components/ComposePollPage';
import PollViewPage from './components/PollViewPage';
import PollsShowcasePage from './components/PollsShowcasePage';
import PollGroup from './models/PollGroup';
import ComposePollGroupPage from './components/ComposePollGroupPage';
import PollGroupListPage from './components/PollGroupListPage';
import PollGroupViewPage from './components/PollGroupViewPage';

export default [
  new Extend.Routes() //
    .add('fof.polls.showcase', '/polls', PollsShowcasePage)
    .add('fof.polls.list', '/polls/all', PollsPage)
    .add('fof.polls.view', '/polls/view/:id', PollViewPage)
    .add('fof.polls.composer', '/polls/composer', ComposePollPage)
    .add('fof.polls.groups.composer', '/polls/groups/composer', ComposePollGroupPage)
    .add('fof.polls.groups.list', '/polls/groups', PollGroupListPage)
    .add('fof.polls.groups.view', '/polls/groups/:id', PollGroupViewPage),

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
