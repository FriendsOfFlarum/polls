import * as Mithril from 'mithril';
import app from 'flarum/forum/app';
import Page from 'flarum/common/components/Page';

export default class PollPage extends Page {
  view(): Mithril.Children {
    return <p>PollPage</p>;
  }
}
