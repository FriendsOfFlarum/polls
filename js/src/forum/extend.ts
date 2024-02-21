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

export default [
  new Extend.Routes() //
    .add('fof.polls.list', '/polls', PollsPage)
    .add('fof.polls.view', '/polls/view/:id', PollViewPage)
    .add('fof.polls.compose', '/polls/composer', ComposePollPage),

  new Extend.Store() //
    .add('polls', Poll)
    .add('poll_options', PollOption)
    .add('poll_votes', PollVote),

  new Extend.Model(Post) //
    .hasMany<Poll>('polls')
    .attribute<boolean>('canStartPoll'),

  new Extend.Model(Forum) //
    .attribute<boolean>('canStartPolls'),

  new Extend.Model(Discussion) //
    .attribute<boolean>('hasPoll')
    .attribute<boolean>('canStartPoll'),
];
