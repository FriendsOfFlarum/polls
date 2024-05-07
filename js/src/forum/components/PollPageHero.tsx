import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import classList from 'flarum/common/utils/classList';
import icon from 'flarum/common/helpers/icon';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';

interface PollPageHeroAttrs extends ComponentAttrs {
  icon?: string;
  title?: string;
}

export default class PollPageHero extends Component<PollPageHeroAttrs> {
  oninit(vnode: Mithril.Vnode) {
    super.oninit(vnode);
  }

  get classNames(): string {
    return classList({
      PollPageHero: true,
      Hero: true,
    });
  }

  get wrapperClasses(): string {
    return classList({
      'PollPageHero--wrapper': true,
    });
  }

  oncreate(vnode: Mithril.Vnode): void {
    super.oncreate(vnode);
  }

  get title() {
    return this.attrs.title || app.translator.trans('fof-polls.forum.polls_page.title');
  }

  get icon() {
    return this.attrs.icon || 'fas fa-poll';
  }

  view() {
    return (
      <div className={this.wrapperClasses}>
        <header className={this.classNames}>
          <div className="container">
            <div className="containerNarrow">{this.items().toArray()}</div>
          </div>
        </header>
      </div>
    );
  }

  items() {
    const items = new ItemList();
    items.add('title', <h2 className="Hero-title">{[icon(this.icon), ' ', this.title]}</h2>, 50);

    return items;
  }
}
