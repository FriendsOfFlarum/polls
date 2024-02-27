import app from 'flarum/forum/app';
import Page, { IPageAttrs } from 'flarum/common/components/Page';
import IndexPage from 'flarum/forum/components/IndexPage';
import Link from 'flarum/common/components/Link';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import listItems from 'flarum/common/helpers/listItems';
import ItemList from 'flarum/common/utils/ItemList';
import humanTime from 'flarum/common/helpers/humanTime';
import textContrastClass from 'flarum/common/helpers/textContrastClass';
import classList from 'flarum/common/utils/classList';
import Mithril from 'mithril';
import Poll from '../models/Poll';
import PollListState from '../states/PollListState';
import extractText from 'flarum/common/utils/extractText';
import PollList from './Poll/PollList';
import Button from 'flarum/common/components/Button';
import LogInModal from 'flarum/forum/components/LogInModal';
import { AbstractPollPage } from './AbstractPollPage';
import PollShowcase from './PollShowcase';

export default class PollsShowcasePage extends AbstractPollPage {
  oninit(vnode: Mithril.Vnode<IPageAttrs, PollListState>) {
    super.oninit(vnode);

    this.state = new PollListState({
      sort: m.route.param('sort'),
      filter: m.route.param('filter'),
    });

    this.state.refresh();

    app.setTitle(extractText(app.translator.trans('fof-polls.forum.page.nav')));
  }

  contentItems(): ItemList<Mithril.Children> {
    const items = super.contentItems();

    if (!this.loading) {
      items.add('poll-showcase', <PollShowcase state={this.state} />);
    }

    return items;
  }

  sidebarItems(): ItemList<Mithril.Children> {
    const items = super.sidebarItems();
    const canStartPoll = app.forum.attribute<boolean>('canStartGlobalPolls');

    if (canStartPoll) {
      items.remove('newDiscussion');
      items.add(
        'newGlobalPoll',
        <Button
          icon="fas fa-edit"
          className="Button Button--primary App-primaryControl PollsPage-newPoll"
          itemClassName="App-primaryControl"
          onclick={() => {
            this.newPollAction();
          }}
          disabled={!canStartPoll}
        >
          {app.translator.trans(`fof-polls.forum.poll.${canStartPoll ? 'start_poll_button' : 'cannot_start_poll_button'}`)}
        </Button>,
        100
      );
    }

    return items;
  }

  newPollAction(): void {
    if (!app.session.user) {
      app.modal.show(LogInModal);
      return;
    }

    m.route.set(app.route('fof.polls.compose'));
  }

  //   tagTileListView(pinned) {
  //     return <ul className="TagTiles">{pinned.map(this.tagTileView.bind(this))}</ul>;
  //   }

  //   tagTileView(tag) {
  //     const lastPostedDiscussion = tag.lastPostedDiscussion();
  //     const children = sortTags(tag.children() || []);

  //     return (
  //       <li className={classList('TagTile', { colored: tag.color() }, textContrastClass(tag.color()))} style={{ '--tag-bg': tag.color() }}>
  //         <Link className="TagTile-info" href={app.route.tag(tag)}>
  //           {tag.icon() && tagIcon(tag, {}, { useColor: false })}
  //           <h3 className="TagTile-name">{tag.name()}</h3>
  //           <p className="TagTile-description">{tag.description()}</p>
  //           {!!children && (
  //             <div className="TagTile-children">{children.map((child) => [<Link href={app.route.tag(child)}>{child.name()}</Link>, ' '])}</div>
  //           )}
  //         </Link>
  //         {lastPostedDiscussion ? (
  //           <Link className="TagTile-lastPostedDiscussion" href={app.route.discussion(lastPostedDiscussion, lastPostedDiscussion.lastPostNumber())}>
  //             <span className="TagTile-lastPostedDiscussion-title">{lastPostedDiscussion.title()}</span>
  //             {humanTime(lastPostedDiscussion.lastPostedAt())}
  //           </Link>
  //         ) : (
  //           <span className="TagTile-lastPostedDiscussion" />
  //         )}
  //       </li>
  //     );
  //   }

  //   cloudView(cloud) {
  //     return <div className="TagCloud">{cloud.map((tag) => [tagLabel(tag, { link: true }), ' '])}</div>;
  //   }
}
