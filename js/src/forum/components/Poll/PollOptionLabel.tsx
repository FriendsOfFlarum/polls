import * as Mithril from 'mithril';
import Component from 'flarum/common/Component';

export default class PollOptionLabel extends Component {
  view(): Mithril.Children {
    return (
      <span id="privacy-setting-1-label" className="PollOption-label">
        Private to Project Members test 23
      </span>
    );
  }
}
