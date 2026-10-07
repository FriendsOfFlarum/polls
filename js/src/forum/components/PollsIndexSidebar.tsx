import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import Button from 'flarum/common/components/Button';
import SelectDropdown from 'flarum/common/components/SelectDropdown';
import ItemList from 'flarum/common/utils/ItemList';
import extractText from 'flarum/common/utils/extractText';

export default class PollsIndexSidebar extends IndexSidebar {
  items(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const canStartPoll = app.forum.attribute<boolean>('canStartGlobalPolls');

    if (app.current.get('routeName') !== 'fof.polls.composer') {
      const label = app.translator.trans(`fof-polls.forum.poll.${canStartPoll ? 'start_poll_button' : 'cannot_start_poll_button'}`);

      items.add(
        'newGlobalPoll',
        <Button
          icon="fas fa-edit"
          className="Button Button--primary App-primaryControl PollsPage-newPoll"
          itemClassName="App-primaryControl"
          aria-label={extractText(label)}
          disabled={!canStartPoll}
          onclick={() => this.newPollAction()}
        >
          {label}
        </Button>
      );
    }

    items.add(
      'nav',
      <SelectDropdown
        buttonClassName="Button"
        className="App-titleControl"
        accessibleToggleLabel={app.translator.trans('core.forum.index.toggle_sidenav_dropdown_accessible_label')}
        defaultLabel={app.translator.trans('fof-polls.forum.page.nav')}
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
