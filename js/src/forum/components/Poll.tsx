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
          <PollTitle text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy?" />
          <PollDescription text="At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet!" />

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
