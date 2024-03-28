import app from 'flarum/forum/app';

import { extend } from 'flarum/common/extend';
import PostControls from 'flarum/forum/utils/PostControls';
import CreatePollModal from './components/CreatePollModal';
import Button from 'flarum/common/components/Button';
import Post from 'flarum/common/models/Post';
import PollModelAttributes from './models/PollModelAttributes';

export default () => {
  const createPoll = (post: Post) =>
    app.modal.show(CreatePollModal, {
      onsubmit: (data: PollModelAttributes) =>
        app.store
          .createRecord('polls')
          .save(
            {
              ...data,
              relationships: {
                post,
              },
            },
            {
              data: {
                include: 'options,myVotes,myVotes.option',
              },
            }
          )
          .then((poll) => {
            // @ts-ignore
            post.rawRelationship('polls')?.push?.({ type: 'polls', id: poll.id() });

            return poll;
          }),
    });

  extend(PostControls, 'moderationControls', function (items, post) {
    // @ts-ignore
    if (!post.isHidden() && post.canStartPoll()) {
      items.add(
        'addPoll',
        <Button icon="fas fa-poll" onclick={createPoll.bind(this, post)}>
          {app.translator.trans('fof-polls.forum.moderation.add')}
        </Button>
      );
    }
  });
};
