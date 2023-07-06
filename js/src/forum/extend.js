import Extend from 'flarum/common/extenders';
import Post from 'flarum/common/models/Post';
import User from 'flarum/common/models/User';
import Discussion from 'flarum/common/models/Discussion';
import Poll from './models/Poll';
import PollOption from './models/PollOption';
import PollVote from './models/PollVote';

export default [
  new Extend.Store().add('polls', Poll).add('poll_options', PollOption).add('poll_votes', PollVote),

  new Extend.Model(Post).hasMany('polls'),

  new Extend.Model(User).attribute('canStartPolls'),

  new Extend.Model(Discussion).attribute('hasPoll').attribute('canStartPoll'),
];
