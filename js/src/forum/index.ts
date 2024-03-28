import app from 'flarum/forum/app';

import addDiscussionBadge from './addDiscussionBadge';
import addComposerItems from './addComposerItems';
import addPollsToPost from './addPollsToPost';
import addPostControls from './addPostControls';
import addNavItem from './addNavItem';

export * from './components';
export * from './models';
export * from './states';
export * from './utils';

app.initializers.add('fof/polls', () => {
  addDiscussionBadge();
  addComposerItems();
  addPollsToPost();
  addPostControls();
  addNavItem();
});

export { default as extend } from './extend';
