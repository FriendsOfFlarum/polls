import app from 'flarum/forum/app';

import addDiscussionBadge from './addDiscussionBadge';
import addComposerItems from './addComposerItems';
import addPollsLink from './addPollsLink';
import addPollsToPost from './addPollsToPost';
import addPostControls from './addPostControls';

export * from './components';
export * from './models';

import PollsPage from './components/PollsPage';

app.initializers.add('fof/polls', () => {
  addDiscussionBadge();
  addComposerItems();
  addPollsLink();
  addPollsToPost();
  addPostControls();

  // TMP
  app.routes.polls = {
    path: '/polls',
    component: PollsPage,
  };
});

export { default as extend } from './extend';
