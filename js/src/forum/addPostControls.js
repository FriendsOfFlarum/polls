import app from 'flarum/forum/app';

import { extend } from 'flarum/common/extend';
import PostControls from 'flarum/forum/utils/PostControls';
import CreatePollModal from './components/CreatePollModal';
import Button from 'flarum/common/components/Button';

export default () => {
  const createPoll = (post) =>
    app.modal.show(CreatePollModal, {
      onsubmit: (data) =>
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
            post.rawRelationship('polls')?.push?.({ type: 'polls', id: poll.id() });

            return poll;
          }),
    });

  extend(PostControls, 'moderationControls', function (items, post) {
    if (!post.isHidden() && post.canEdit() && post.discussion().canStartPoll?.()) {
      items.add(
        'addPoll',
        <Button icon="fas fa-poll" onclick={createPoll.bind(this, post)}>
          {app.translator.trans('fof-polls.forum.moderation.add')}
        </Button>
      );
    }
  });
};
