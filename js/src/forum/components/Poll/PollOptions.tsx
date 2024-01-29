import * as Mithril from 'mithril';
import Component from 'flarum/common/Component';
import PollOption from './PollOption';
import listItems from 'flarum/common/helpers/listItems';
import ItemList from 'flarum/common/utils/ItemList';

export default class PollOptions extends Component {
  view(): Mithril.Children {
    return (
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
        {this.pollOptions().toArray()}
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
    );
  }

  pollOptions(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('test', <PollOption />);

    return items;
  }
}
