import Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import { slug } from '../../common';
import LinkButton from 'flarum/common/components/LinkButton';

const t = app.translator.trans.bind(app.translator);
const prfx = `${slug}.forum.compose`;

export default class ComposePollHero extends Component {
  view(): Mithril.Children {
    const { poll } = this.attrs;

    return (
      <div className="ComposeGoodieCollectionHero Hero IndexPageHero">
        <div className="container">
          <div className="containerNarrow">
            <h2 className="Hero-title">{t(`${prfx}.${!!poll.id() ? 'edit' : 'add'}_title`)}</h2>
            <div className="IndexPageHero-controls">
              <LinkButton
                icon="far fa-edit"
                className="Button Button--primary IndexPage-newDiscussion GoodiesManagerLink"
                itemClassName="App-primaryControl"
                href={app.route('fof_polls_list')}
              >
                {t(`${prfx}.polls_manager`)}
              </LinkButton>
              {poll.exists && (
                <LinkButton
                  icon="far fa-arrow-up-right-from-square"
                  className="Button Button--primary IndexPage-newDiscussion GoodiePreviewLink"
                  itemClassName="App-primaryControl"
                  href={app.route('fof_polls_list', { id: poll.id() })}
                  external={true}
                  target="_blank"
                >
                  {t(`${prfx}.polls_preview`)}
                </LinkButton>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
