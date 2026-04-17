import app from 'flarum/forum/app';

import addDiscussionBadge from './addDiscussionBadge';
import addComposerItems from './addComposerItems';
import addPollsToPost from './addPollsToPost';
import addPostControls from './addPostControls';
import addNavItem from './addNavItem';

export { default as extend } from './extend';

app.initializers.add('fof/polls', () => {
  // Discussion poll features (badge, composer, post rendering, controls) are
  // always registered here. The backend conditionally includes the relevant
  // API fields/relationships only when discussion polls are enabled, so these
  // extensions naturally do nothing when the setting is off.
  addDiscussionBadge();
  addComposerItems();
  addPollsToPost();
  addPostControls();
  addNavItem();
});
