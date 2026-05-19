import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Poll from '../../models/Poll';

export interface IPollDraftBadgesAttrs extends ComponentAttrs {
  poll: Poll;
}

/**
 * Renders the "Draft" and (optional) "Scheduled" status pills for a poll.
 * Shared between the poll list row and the poll view page so both surfaces
 * expose the same visual cue.
 */
export default class PollDraftBadges extends Component<IPollDraftBadgesAttrs> {
  view(): Mithril.Children {
    const poll = this.attrs.poll;
    if (!poll.isDraft()) return null;

    return (
      <span className="PollDraftBadges">
        <span className="PollDraftBadges-draft" title={app.translator.trans('fof-polls.forum.poll.draft_label') as string}>
          <i className="icon fa-solid fa-pencil-alt" /> {app.translator.trans('fof-polls.forum.poll.draft_label')}
        </span>
        {poll.isScheduled() && (
          <span className="PollDraftBadges-scheduled">
            <i className="icon fa-solid fa-clock" />{' '}
            {app.translator.trans('fof-polls.forum.poll.scheduled_label', {
              date: dayjs(poll.scheduledPublishAt()!).format('lll'),
            })}
            {poll.scheduledPublishError() && (
              <span className="PollDraftBadges-scheduleError" title={poll.scheduledPublishError() as string}>
                <i className="icon fa-solid fa-exclamation-triangle" />
              </span>
            )}
          </span>
        )}
      </span>
    );
  }
}
