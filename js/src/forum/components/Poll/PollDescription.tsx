import * as Mithril from 'mithril';
import Component from 'flarum/common/Component';

export default class PollDescription extends Component {
  view(): Mithril.Children {
    return (
      <>
        <p className="PollOption-description">Lorem Ipsum Dolor Sit amet Consectetur Adipiscing Elit Sit</p>
      </>
    );
  }
}
