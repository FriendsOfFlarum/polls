import * as Mithril from 'mithril';
import Component from 'flarum/common/Component';

import PollTitle from './Poll/PollTitle';
import PollDescription from './Poll/PollDescription';
import PollOption from './Poll/PollOption';
import PollSubmitButton from './Poll/PollSubmitButton';
export default class IndexPolls extends Component {
  view(): Mithril.Children {
    return (
      <div className="Index-poll">
        <PollTitle />
        <PollDescription />
        <form>
          <fieldset>
            <legend className="sr-only">Privacy setting</legend>
            <div className="aaa">
              <label className="ba bbb">
                <input
                  type="radio"
                  name="privacy-setting"
                  value="Public access"
                  className="ccc"
                  aria-labelledby="privacy-setting-0-label"
                  aria-describedby="privacy-setting-0-description"
                />
                <span className="ddd">
                  <span id="privacy-setting-0-label" className="fff">
                    Public access
                  </span>
                  <span id="privacy-setting-0-description" className="ggg">
                    This project would be available to anyone who has the link
                  </span>
                </span>
              </label>
              <PollOption />
              <label className="bba bbb">
                <input
                  type="radio"
                  name="privacy-setting"
                  value="Private to you"
                  className="ccc"
                  aria-labelledby="privacy-setting-2-label"
                  aria-describedby="privacy-setting-2-description"
                />
                <span className="ddd">
                  <span id="privacy-setting-2-label" className="fff">
                    Private to you
                  </span>
                  <span id="privacy-setting-2-description" className="ggg">
                    You are the only one able to access this project
                  </span>
                </span>
              </label>
            </div>
            <PollSubmitButton />
          </fieldset>
        </form>
      </div>
    );
  }
}
