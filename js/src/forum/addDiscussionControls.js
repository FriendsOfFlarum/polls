import app from 'flarum/forum/app';

import { extend } from 'flarum/common/extend';
import PostControls from 'flarum/forum/utils/PostControls';
import Button from 'flarum/common/components/Button';

import EditPollModal from './components/EditPollModal';

export default () => {
    extend(PostControls, 'moderationControls', function (items, post) {
        const discussion = post.discussion();
        const poll = discussion.poll();
        const user = app.session.user;

        if (
            !(
                poll &&
                ((user && user.canEditPolls()) || (post.user() && post.user().canSelfEditPolls() && post.user().id() === user.id())) &&
                post.number() === 1
            )
        ) {
            return;
        }

        if (!poll.hasEnded()) {
            items.add(
                'fof-polls-edit',
                Button.component(
                    {
                        icon: 'fas fa-check-square',
                        onclick: () => app.modal.show(EditPollModal, { poll: poll }),
                    },
                    app.translator.trans('fof-polls.forum.moderation.edit')
                )
            );
        }

        items.add(
            'fof-polls-remove',
            Button.component(
                {
                    icon: 'fas fa-trash',
                    onclick: () => {
                        if (confirm(app.translator.trans('fof-polls.forum.moderation.delete_confirm'))) {
                            poll.delete().then(() => {
                                m.redraw.sync();
                            });
                        }
                    },
                },
                app.translator.trans('fof-polls.forum.moderation.delete')
            )
        );
    });
};
