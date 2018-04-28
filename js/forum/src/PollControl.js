import {extend} from 'flarum/extend';

import PostControls from 'flarum/utils/PostControls';
import Button from 'flarum/components/Button';
import EditPollModal from 'reflar/polls/components/EditPollModal';

export default function () {
    extend(PostControls, 'moderationControls', function (items, post) {
        const discussion = post.discussion();
        const poll = discussion.Poll();
        const user = app.session.user

        if (discussion.Poll() && (user.canEditPolls() || (post.user().canSelfEditPolls()) && post.user().id() === user.id()) && post.number() === 1) {
            items.add('editPoll', [
                m(Button, {
                    icon: 'check-square',
                    className: 'reflar-PollButton',
                    onclick: () => {
                        app.modal.show(new EditPollModal({post: post, poll: poll}));
                    }
                }, app.translator.trans('reflar-polls.forum.moderation.edit'))
            ]);

            items.add('removePoll', [
                m(Button, {
                    icon: 'trash',
                    className: 'reflar-PollButton',
                    onclick: () => {

                        if (confirm(app.translator.trans('reflar-polls.forum.moderation.delete_confirm'))) {
                            app.request({
                                url: app.forum.attribute('apiUrl') + '/questions/' + poll.id(),
                                method: 'DELETE',
                                data: poll.store.data.users[Object.keys(poll.store.data.users)[0]].id()
                            }).then(() => {
                                location.reload()
                            })
                        }
                    }
                }, app.translator.trans('reflar-polls.forum.moderation.delete'))
            ]);
        }
    });
}
