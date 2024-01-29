import * as Mithril from 'mithril';
import Component from 'flarum/common/Component';

export default class PollOptionDescription extends Component {
  view(): Mithril.Children {
    return (
      <span id="privacy-setting-1-description" className="PollOption-description">
        Only members of this project would be able to access 3
      </span>
    );
  }
}
