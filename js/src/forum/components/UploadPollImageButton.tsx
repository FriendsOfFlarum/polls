import app from 'flarum/forum/app';
import Button, { IButtonAttrs } from 'flarum/common/components/Button';
import classList from 'flarum/common/utils/classList';
import type Mithril from 'mithril';
import Poll from '../models/Poll';

export interface UploadPollImageButtonAttrs extends IButtonAttrs {
  className?: string;
  loading?: boolean;
  name: string;
  onclick: () => void;
  poll?: Poll | null;
  onUpload: (fileName: string) => void;
}

export interface PollUploadObject {
  fileUrl: string;
  fileName: string;
}

export default class UploadPollImageButton extends Button<UploadPollImageButtonAttrs> {
  loading: boolean = false;
  uploadedImageUrl: string | undefined = undefined;
  fileName: string | undefined = undefined;

  view(vnode: Mithril.Vnode<UploadPollImageButtonAttrs>) {
    this.attrs.loading = this.loading;
    this.attrs.className = classList(this.attrs.className, 'Button');

    if (this.attrs.poll?.imageUrl() || this.uploadedImageUrl) {
      const imageUrl = this.uploadedImageUrl || this.attrs.poll?.imageUrl();
      this.attrs.onclick = this.remove.bind(this);

      return (
        <div>
          <p>
            <img src={imageUrl} alt="" />
          </p>
          <p>{super.view({ ...vnode, children: app.translator.trans('fof-polls.upload_image.remove_button') })}</p>
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

    const $input = $('<input type="file">');

    $input
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
      .request({
        method: 'DELETE',
        url: this.resourceUrl(),
      })
      .then(this.success.bind(this), this.failure.bind(this));
  }

  resourceUrl() {
    return app.forum.attribute('apiUrl') + '/fof/polls/' + this.attrs.name;
  }

  /**
   * After a successful upload/removal, redraw the page.
   *
   * @param {PollUploadObject} response
   * @protected
   */
  success(response: PollUploadObject) {
    this.loading = false;
    this.uploadedImageUrl = response.fileUrl;
    this.fileName = response.fileName;

    this.attrs.onUpload?.(response.fileName);
    m.redraw();
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
  }
}
