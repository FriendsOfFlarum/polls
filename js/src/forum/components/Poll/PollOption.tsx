import * as Mithril from 'mithril';
import Component from 'flarum/common/Component';

export default class PollOption extends Component {
  view(): Mithril.Children {
    return (
      <label className="bbb">
        <input
          type="radio"
          name="privacy-setting"
          value="Private to Project Members"
          className="ccc"
          aria-labelledby="privacy-setting-1-label"
          aria-describedby="privacy-setting-1-description"
        />
        <span className="ddd">
          <span id="privacy-setting-1-label" className="fff">
            Private to Project Members test 23
          </span>
          <span id="privacy-setting-1-description" className="ggg">
            Only members of this project would be able to access 3
          </span>
        </span>
      </label>
    );
  }
}
