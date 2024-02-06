import * as Mithril from 'mithril';
import Component from 'flarum/common/Component';

import PollTitle from './Poll/PollTitle';
import PollOptions from './Poll/PollOptions';
import PollSubmitButton from './Poll/PollSubmitButton';
import PollImage from './Poll/PollImage';

export default class IndexPolls extends Component {
  view(): Mithril.Children {
    /* @type Poll */
    const poll = this.attrs.poll;

    return (
      <div className="Poll">
        <div className="Poll-image">
          <PollImage image={poll.image} />
        </div>
        <div className="Poll-wrapper">
          <PollTitle text={poll.question()} />
          <form>
            <fieldset>
              <legend className="sr-only">Antworten</legend>
              <PollOptions options={poll.options()} />
              <PollSubmitButton />
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}
