import Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import LinkButton from 'flarum/common/components/LinkButton';
import Poll from '../models/Poll';

export interface ComposePollHeroAttrs extends ComponentAttrs {
  poll: Poll;
}

export default class ComposePollHero extends Component<ComposePollHeroAttrs> {
  view(): Mithril.Children {
    const { poll } = this.attrs;

    return (
      <div className="ComposeGoodieCollectionHero Hero IndexPageHero">
        <div className="container">
          <div className="containerNarrow">
            <h2 className="Hero-title">{app.translator.trans(`fof-polls.forum.compose.${!!poll.id() ? 'edit' : 'add'}_title`)}</h2>
            <div className="IndexPageHero-controls">
              <LinkButton
                icon="far fa-edit"
                className="Button Button--secondary IndexPage-newDiscussion GoodiesManagerLink"
                itemClassName="App-primaryControl"
                href={app.route('fof.polls.list')}
              >
                {app.translator.trans('fof-polls.forum.compose.polls_manager')}
              </LinkButton>
              {poll.exists && (
                <LinkButton
                  icon="far fa-arrow-up-right-from-square"
                  className="Button Button--secondary IndexPage-newDiscussion GoodiePreviewLink"
                  itemClassName="App-primaryControl"
                  href={app.route('fof.polls.view', { id: poll.id() })}
                >
                  {app.translator.trans('fof-polls.forum.compose.polls_preview')}
                </LinkButton>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
