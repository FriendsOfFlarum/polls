import Component, { ComponentAttrs } from 'flarum/common/Component';
import PollGroup from '../../models/PollGroup';
import classList from 'flarum/common/utils/classList';
import ItemList from 'flarum/common/utils/ItemList';
import app from 'flarum/forum/app';
import PollListState from '../../states/PollListState';
import PollListItem from '../Poll/PollListItem';

interface PollGroupListItemAttrs extends ComponentAttrs {
  pollGroup: PollGroup;
  params?: any;
}

export default class PollGroupListItem extends Component<PollGroupListItemAttrs, PollListState> {

  oninit(vnode: any) {
    super.oninit(vnode);

    this.state = new PollListState({
      filter: {
        pollGroup: this.attrs.pollGroup.id(),
      },
    });
  }

  view() {
    const pollGroup = this.attrs.pollGroup;

    return (
      <div className={classList('PollGroupListItem', 'PollGroupListItem--pollgroup')}>
        <div className="PollGroupListItem-main">
          <h3 className="PollGroupListItem-title">
            {pollGroup.name()}
          </h3>
          <ul className="PollGroupListItem-meta">
            {this.metaItems().toArray()}
          </ul>
          <p className="PollGroupListItem-excerpt"></p>
        </div>

        {this.state.getPages().length > 0 ? (
          <ul className="PollGroupListItem-polls">
            {this.state.getPages().map((pg) => {
              return pg.items.map((poll) => (
                <li key={poll.id()} data-id={poll.id()}>
                  <PollListItem poll={poll} params={{}} />
                </li>
              ));
            })}
          </ul>
        ) : (
          <p>{app.translator.trans('fof-polls.forum.pollgroups_list.no_polls')}</p>
        )}
      </div>
    );
  }

  metaItems(): ItemList<any> {
    const items = new ItemList();
    const pollGroup = this.attrs.pollGroup;

    items.add(
      'user',
      app.translator.trans('fof-polls.forum.pollgroups_list.created_by', {
        user: pollGroup.user(),
      })
    );

    items.add(
      'date',
      app.translator.trans('fof-polls.forum.pollgroups_list.created_at', {
        ago: dayjs(pollGroup.createdAt()).fromNow(),
      })
    );

    return items;
  }
}