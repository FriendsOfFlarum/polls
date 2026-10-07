import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Icon from 'flarum/common/components/Icon';
import Pill from 'flarum/common/components/Pill';
import Tooltip from 'flarum/common/components/Tooltip';
import ItemList from 'flarum/common/utils/ItemList';
import extractText from 'flarum/common/utils/extractText';
import Poll from '../../models/Poll';

export interface IPollDraftBadgesAttrs extends ComponentAttrs {
  poll: Poll;
}

export default class PollDraftBadges<CustomAttrs extends IPollDraftBadgesAttrs = IPollDraftBadgesAttrs> extends Component<CustomAttrs> {
  view(): Mithril.Children {
    if (!this.attrs.poll.isDraft()) return null;

    return <span className="PollDraftBadges">{this.items().toArray()}</span>;
  }

  items(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const poll = this.attrs.poll;

    items.add(
      'draft',
      <Pill className="PollDraftBadges-draft">
        <Icon name="fas fa-pencil-alt" />
        {app.translator.trans('fof-polls.forum.poll.draft_label')}
      </Pill>,
      100
    );

    if (poll.isScheduled()) {
      items.add(
        'scheduled',
        <Pill className="PollDraftBadges-scheduled">
          <Icon name="fas fa-clock" />
          {app.translator.trans('fof-polls.forum.poll.scheduled_label', { date: dayjs(poll.scheduledPublishAt()!).format('lll') })}
          {this.scheduleError()}
        </Pill>,
        50
      );
    }

    return items;
  }

  // Tooltip replaces the aria-label of what it wraps.
  scheduleError(): Mithril.Children {
    if (!this.attrs.poll.scheduledPublishError()) return null;

    return (
      <Tooltip text={extractText(app.translator.trans('fof-polls.forum.poll.scheduled_error_tooltip'))}>
        <span className="PollDraftBadges-scheduleError">
          <Icon name="fas fa-exclamation-triangle" />
        </span>
      </Tooltip>
    );
  }
}
