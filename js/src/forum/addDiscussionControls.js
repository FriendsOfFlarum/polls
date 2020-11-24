import { extend } from 'flarum/extend';
import PostControls from 'flarum/utils/PostControls';
import Button from 'flarum/components/Button';

import EditPollModal from './components/EditPollModal';

export default () => {
    extend(PostControls, 'moderationControls', function(items, post) {
        const discussion = post.discussion();
        const poll = discussion.poll();
        const user = app.session.user;

        if (!(poll && ((user && user.canEditPolls()) || (post.user() && post.user().canSelfEditPolls() && post.user().id() === user.id())) && post.number() === 1)) {
            return;
        }

        if (!poll.hasEnded()) {
            items.add(
                'fof-polls-edit',
                Button.component({
                    icon: 'fas fa-check-square',
                    children: app.translator.trans('fof-polls.forum.moderation.edit'),
                    onclick: () => app.modal.show(new EditPollModal({ poll })),
                })
            );
        }

        items.add(
            'fof-polls-remove',
            Button.component({
                icon: 'fas fa-trash',
                children: app.translator.trans('fof-polls.forum.moderation.delete'),
                onclick: () => {
                    if (confirm(app.translator.trans('fof-polls.forum.moderation.delete_confirm'))) {
                        poll.delete().then(() => {
                            m.redraw.strategy('all');
                            m.redraw();
                            m.redraw.strategy('diff');
                        });
                    }
                },
            })
        );
    });
};
