import { extend } from 'flarum/common/extend';
import PostControls from 'flarum/forum/utils/PostControls';
import Button from 'flarum/common/components/Button';

import EditPollModal from './components/EditPollModal';

export default () => {
    extend(PostControls, 'moderationControls', function (items, post) {
        const discussion = post.discussion();
        const poll = discussion.poll();

        if (!poll) {
            return;
        }

        if (poll.canEdit()) {
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

        if (poll.canDelete()) {
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
        }
    });
};
