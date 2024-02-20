import type Mithril from 'mithril';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';

export default class PollSubmitButton extends Component {
  view(): Mithril.Children {
    return (
      <Button className="Button" onclick={() => this.pollButtonSubmit()}>
        Submit
      </Button>
    );
  }

  /**
   * Event handler for submit button being clicked
   */

  pollButtonSubmit() {
    console.log('submitted');
  }
}
