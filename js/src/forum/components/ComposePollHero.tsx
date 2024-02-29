import Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import LinkButton from 'flarum/common/components/LinkButton';
import Poll from '../models/Poll';
import ItemList from 'flarum/common/utils/ItemList';

export interface ComposePollHeroAttrs extends ComponentAttrs {
  poll: Poll;
}

export default class ComposePollHero extends Component<ComposePollHeroAttrs> {
  poll!: Poll;

  oninit(vnode: Mithril.Vnode<ComposePollHeroAttrs>): void {
    super.oninit(vnode);

    this.poll = this.attrs.poll;
  }

  view(): Mithril.Children {
    return (
      <div className="ComposePollHero Hero IndexPageHero">
        <div className="container">
          <div className="containerNarrow">
            <h2 className="Hero-title">{app.translator.trans(`fof-polls.forum.compose.${!!this.poll.id() ? 'edit' : 'add'}_title`)}</h2>
            <div className="IndexPageHero-controls">{this.controlItems().toArray()}</div>
          </div>
        </div>
      </div>
    );
  }

  controlItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'edit',
      <LinkButton
        icon="far fa-edit"
        className="Button Button--secondary IndexPage-newDiscussion GlobalPollListLink"
        itemClassName="App-primaryControl"
        href={app.route('fof.polls.list')}
      >
        {app.translator.trans('fof-polls.forum.compose.polls_manager')}
      </LinkButton>
    );

    if (this.poll.exists) {
      items.add(
        'view',
        <LinkButton
          icon="far fa-arrow-up-right-from-square"
          className="Button Button--secondary IndexPage-newDiscussion PollPreviewLink"
          itemClassName="App-primaryControl"
          href={app.route('fof.polls.view', { id: this.poll.id() })}
        >
          {app.translator.trans('fof-polls.forum.compose.polls_preview')}
        </LinkButton>
      );
    }

    return items;
  }
}
