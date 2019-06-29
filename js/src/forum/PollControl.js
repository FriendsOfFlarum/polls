import { extend } from 'flarum/extend';

import PostControls from 'flarum/utils/PostControls';
import Button from 'flarum/components/Button';
import EditPollModal from './components/EditPollModal';

export default function() {
    extend(PostControls, 'moderationControls', function(items, post) {
        const discussion = post.discussion();
        const poll = discussion.Poll();
        const user = app.session.user;

        if (
            discussion.Poll() &&
            ((user !== undefined && user.canEditPolls()) || (post.user().canSelfEditPolls() && post.user().id() === user.id())) &&
            post.number() === 1
        ) {
            if (!poll.isEnded()) {
                items.add('editPoll', [
                    m(
                        Button,
                        {
                            icon: 'fa fa-check-square',
                            className: 'reflar-PollButton',
                            onclick: () => {
                                app.modal.show(new EditPollModal({ post: post, poll: poll }));
                            },
                        },
                        app.translator.trans('reflar-polls.forum.moderation.edit')
                    ),
                ]);
            }

            items.add('removePoll', [
                m(
                    Button,
                    {
                        icon: 'fa fa-trash',
                        className: 'reflar-PollButton',
                        onclick: () => {
                            if (confirm(app.translator.trans('reflar-polls.forum.moderation.delete_confirm'))) {
                                app.request({
                                    url: `${app.forum.attribute('apiUrl')}/reflar/polls/${poll.id()}`,
                                    method: 'DELETE',
                                    data: poll.store.data.users[Object.keys(poll.store.data.users)[0]].id(),
                                }).then(() => {
                                    location.reload();
                                });
                            }
                        },
                    },
                    app.translator.trans('reflar-polls.forum.moderation.delete')
                ),
            ]);
        }
    });
}
