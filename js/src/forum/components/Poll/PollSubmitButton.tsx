import * as Mithril from 'mithril';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';

export default class PollSubmitButton extends Component {
  view(): Mithril.Children {
    return (
      <Button className="Button" type="submit">
        Submit
      </Button>
    );
  }
}
