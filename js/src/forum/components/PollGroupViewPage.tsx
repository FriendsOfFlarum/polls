import app from 'flarum/forum/app';
import Mithril from 'mithril';
import PollGroup from '../models/PollGroup';
import PollGroupListItem from './PollGroup/PollGroupListItem';
import ItemList from 'flarum/common/utils/ItemList';
import { AbstractPollGroupsPage } from './AbstractPollGroupsPage';

export default class PollGroupViewPage extends AbstractPollGroupsPage {
  oninit(vnode: Mithril.Vnode) {
    if (!app.forum.attribute<boolean>('pollGroupsEnabled')) {
      m.route.set('/');
      return;
    }

    const editId = m.route.param('id');
    this.pollGroup = app.store.getById<PollGroup>('poll', editId) || null;

    if (!this.pollGroup) {
      this.loading = true;

      app.store.find<PollGroup>('fof/polls/groups', editId).then((item) => {
        this.pollGroup = item;
        this.loading = false;
        app.setTitle(this.pollGroup.name());
        m.redraw();
      });
    }
  }

  contentItems(): ItemList<Mithril.Children> {
    const items = super.contentItems();

    if (this.pollGroup) {
      items.add('pollGroup', <PollGroupListItem pollGroup={this.pollGroup} compactView={false} />);
    }

    return items;
  }
}
