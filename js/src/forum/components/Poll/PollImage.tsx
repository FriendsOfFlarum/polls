import type Mithril from 'mithril';
import Component from 'flarum/common/Component';

export default class PollImage extends Component {
  view(): Mithril.Children {
    const imageUrl = this.attrs.imageUrl;

    return <img src={imageUrl} alt="" />;
  }
}
