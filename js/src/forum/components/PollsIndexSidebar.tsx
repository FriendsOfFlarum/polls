import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import ItemList from 'flarum/common/utils/ItemList';
import Button from 'flarum/common/components/Button';
import SelectDropdown from 'flarum/common/components/SelectDropdown';

export default class PollsIndexSidebar extends IndexSidebar {
  items() {
    const items = new ItemList<Mithril.Children>();
    const canStartPoll = app.forum.attribute<boolean>('canStartGlobalPolls');

    if (app.current.get('routeName') !== 'fof.polls.composer') {
      items.add(
        'newGlobalPoll',
        <Button
          icon="fas fa-edit"
          className="Button Button--primary App-primaryControl PollsPage-newPoll"
          itemClassName="App-primaryControl"
          onclick={() => this.newPollAction()}
          disabled={!canStartPoll}
        >
          {app.translator.trans(`fof-polls.forum.poll.${canStartPoll ? 'start_poll_button' : 'cannot_start_poll_button'}`)}
        </Button>
      );
    }

    items.add(
      'nav',
      <SelectDropdown
        buttonClassName="Button"
        className="App-titleControl"
        accessibleToggleLabel={app.translator.trans('core.forum.index.toggle_sidenav_dropdown_accessible_label')}
      >
        {this.navItems().toArray()}
      </SelectDropdown>
    );

    return items;
  }

  newPollAction(): void {
    if (!app.session.user) {
      app.modal.show(() => import('flarum/forum/components/LogInModal'));
      return;
    }

    m.route.set(app.route('fof.polls.composer'));
  }
}
