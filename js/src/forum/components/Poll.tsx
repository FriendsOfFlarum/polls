import * as Mithril from 'mithril';
import Component from 'flarum/common/Component';

import PollTitle from './Poll/PollTitle';
import PollDescription from './Poll/PollDescription';
import PollOptions from './Poll/PollOptions';
import PollSubmitButton from './Poll/PollSubmitButton';
import PollImage from './Poll/PollImage';
export default class IndexPolls extends Component {
  view(): Mithril.Children {
    return (
      <div className="Poll">
        <div className="Poll-image">
          <PollImage />
        </div>
        <div className="Poll-wrapper">
          <PollTitle text="Poll Title" />
          <PollDescription text="Poll Description" />
          <form>
            <fieldset>
              <legend className="sr-only">Privacy setting</legend>
              <PollOptions />
              <PollSubmitButton />
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}
