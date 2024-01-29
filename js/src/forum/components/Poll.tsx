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
          <PollTitle text="Welche Art von zukünftigen Entscheidungen der SBB würden Sie gerne mehr einbezogen sehen?" />
          <PollDescription text="Ihre Meinung ist uns wichtig! Welche SBB-Entscheidungen möchten Sie mehr einbezogen sehen? Teilen Sie uns mit, welche Themen für Sie besonders relevant sind. Vielen Dank für Ihre Teilnahme!" />

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
