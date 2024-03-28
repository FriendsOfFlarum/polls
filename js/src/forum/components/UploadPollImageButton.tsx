import app from 'flarum/forum/app';
import Button, { IButtonAttrs } from 'flarum/common/components/Button';
import classList from 'flarum/common/utils/classList';
import type Mithril from 'mithril';
import Poll from '../models/Poll';
import PollOption from '../models/PollOption';

export interface UploadPollImageButtonAttrs extends IButtonAttrs {
  className?: string;
  loading?: boolean;
  name: string;
  onclick: () => void;
  poll?: Poll | null;
  option?: PollOption | null;
  onUpload: (fileName: string | null | undefined) => void;
}

export interface PollUploadObject {
  fileUrl: string;
  fileName: string;
}

export default class UploadPollImageButton extends Button<UploadPollImageButtonAttrs> {
  loading: boolean = false;
  uploadedImageUrl: string | undefined | false = false;
  fileName: string | undefined = undefined;
  $input: JQuery<HTMLElement> | undefined;

  view(vnode: Mithril.Vnode<UploadPollImageButtonAttrs>) {
    this.attrs.loading = this.loading;
    this.attrs.className = classList(this.attrs.className, 'Button');

    const imageUrl = this.getImageUrl();

    if (imageUrl) {
      this.attrs.onclick = this.remove.bind(this);

      return (
        <div>
          <p>
            <img src={imageUrl} alt="" />
          </p>
          <p>{super.view({ ...vnode, children: app.translator.trans('fof-polls.forum.upload_image.remove_button') })}</p>
        </div>
      );
    } else {
      this.attrs.onclick = this.upload.bind(this);
    }

    return super.view({ ...vnode, children: app.translator.trans('fof-polls.forum.upload_image.upload_button') });
  }

  /**
   * Prompt the user to upload an image.
   */
  upload() {
    if (this.loading) return;

    this.$input = $('<input type="file">');

    this.$input
      .appendTo('body')
      .hide()
      .trigger('click')
      .on('change', (e) => {
        const body = new FormData();
        body.append(this.attrs.name, $(e.target)[0].files[0]);

        this.loading = true;
        m.redraw();

        app
          .request({
            method: 'POST',
            url: this.resourceUrl(),
            serialize: (raw) => raw,
            body,
          })
          .then(this.success.bind(this), this.failure.bind(this));
      });
  }

  /**
   * Remove the image.
   */
  remove() {
    this.loading = true;
    m.redraw();

    app
      .request<PollUploadObject>({
        method: 'DELETE',
        url: this.resourceUrl(),
      })
      .then(this.success.bind(this), this.failure.bind(this));
  }

  resourceUrl() {
    let url = app.forum.attribute('apiUrl') + '/fof/polls/' + this.attrs.name;
    const poll = this.attrs.poll;
    const option = this.attrs.option;

    if (poll?.exists) url += '/' + poll?.id();
    if (option?.exists) url += '/' + option?.id();

    return url;
  }

  getImageUrl() {
    if (this.uploadedImageUrl !== false) {
      return this.uploadedImageUrl;
    }

    return this.attrs.poll?.imageUrl() || this.attrs.option?.imageUrl();
  }

  /**
   * After a successful upload/removal, redraw the page.
   *
   * @param {PollUploadObject} response
   * @protected
   */
  success(response: PollUploadObject | null) {
    this.loading = false;
    this.uploadedImageUrl = response?.fileUrl;
    this.fileName = response?.fileName;

    this.attrs.onUpload?.(response?.fileName);
    m.redraw();
    this.$input?.remove();
  }

  /**
   * If upload/removal fails, stop loading.
   *
   * @param {object} response
   * @protected
   */
  failure(response: object) {
    this.loading = false;
    m.redraw();
    this.$input?.remove();
  }
}
