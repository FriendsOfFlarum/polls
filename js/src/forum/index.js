import app from 'flarum/forum/app';

import addDiscussionBadge from './addDiscussionBadge';
import addComposerItems from './addComposerItems';
import addPollsToPost from './addPollsToPost';

export * from './components';
export * from './models';

app.initializers.add('fof/polls', () => {
  addDiscussionBadge();
  addComposerItems();
  addPollsToPost();
});

export { default as extend } from './extend';
