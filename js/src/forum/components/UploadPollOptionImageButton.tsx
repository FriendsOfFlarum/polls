import app from 'flarum/forum/app';
import UploadPollImageButton, { UploadPollImageButtonAttrs } from './UploadPollImageButton';
import PollOption from '../models/PollOption';

export interface UploadPollOptionImageButtonAttrs extends UploadPollImageButtonAttrs {
  option: PollOption;
}

export default class UploadPollOptionImageButton extends UploadPollImageButton<UploadPollOptionImageButtonAttrs> {
  view(vnode: Mithril.Vnode<UploadPollOptionImageButtonAttrs>) {
    const poll = this.attrs.poll;
    if (poll?.exists) {
      return super.view(vnode);
    }

    return <p className="UploadPollOptionImageButton-info">{app.translator.trans('fof-polls.forum.modal.option_image.requires_saved_poll')}</p>;
  }

  resourceUrl() {
    let url = app.forum.attribute('apiUrl') + '/fof/polls/pollOptionImage';
    const poll = this.attrs.poll;
    const option = this.attrs.option;

    if (poll?.exists) url += '/' + poll?.id();
    if (option?.exists) url += '/' + option?.id();

    return url;
  }
}
