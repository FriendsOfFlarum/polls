import app from 'flarum/forum/app';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import ItemList from 'flarum/common/utils/ItemList';
import PollGroupList from './PollGroup/PollGroupList';
import Mithril from 'mithril';
import PollGroupListState from '../states/PollGroupListState';
import { AbstractPollGroupsPage } from './AbstractPollGroupsPage';

export default class PollGroupListPage extends AbstractPollGroupsPage {
  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);

    if (!app.forum.attribute<boolean>('pollGroupsEnabled')) {
      m.route.set('/');
      return;
    }

    this.state = new PollGroupListState({
      sort: m.route.param('sort'),
      filter: m.route.param('filter'),
    });

    this.state.refresh();
  }

  contentItems(): ItemList<Mithril.Children> {
    const items = super.contentItems();

    items.add('pollGroupList', <PollGroupList state={this.state} />, 10);

    return items;
  }
}
