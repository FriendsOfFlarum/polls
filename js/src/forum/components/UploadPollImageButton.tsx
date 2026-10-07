import type Mithril from 'mithril';
import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Button, { IButtonAttrs } from 'flarum/common/components/Button';
import classList from 'flarum/common/utils/classList';
import Poll from '../models/Poll';
import PollOption from '../models/PollOption';

export interface IUploadPollImageButtonAttrs extends IButtonAttrs {
  name: string;
  className?: string;
  poll?: Poll | null;
  option?: PollOption | null;
  onUpload: (fileName: string | null | undefined) => void;
}

export interface PollUploadObject {
  fileUrl: string;
  fileName: string;
}

// Core's UploadImageButton reloads the page on success and addresses one fixed
// route. Only its markup is reused here.
export default class UploadPollImageButton<
  CustomAttrs extends IUploadPollImageButtonAttrs = IUploadPollImageButtonAttrs,
> extends Component<CustomAttrs> {
  loading: boolean = false;
  uploadedImageUrl: string | undefined | false = false;
  fileName: string | undefined = undefined;
  $input: JQuery<HTMLElement> | undefined;

  view(vnode: Mithril.Vnode<CustomAttrs, this>) {
    const { name, poll, option, onUpload, className, ...attrs } = this.attrs as IUploadPollImageButtonAttrs;
    const imageUrl = this.getImageUrl();

    const buttonAttrs = {
      ...attrs,
      className: classList('Button', className),
      loading: this.loading,
    };

    return (
      <div className="UploadImageButton">
        {imageUrl && (
          <div className="UploadImageButton-image">
            <img src={imageUrl} alt={this.imageAlt()} />
          </div>
        )}
        <Button {...buttonAttrs} onclick={imageUrl ? this.remove.bind(this) : this.upload.bind(this)}>
          {app.translator.trans(`fof-polls.forum.upload_image.${imageUrl ? 'remove' : 'upload'}_button`)}
        </Button>
      </div>
    );
  }

  imageAlt(): string {
    return this.attrs.poll?.imageAlt() || this.attrs.option?.answer() || '';
  }

  upload(): void {
    if (this.loading) return;

    this.$input = $('<input type="file">');

    this.$input
      .appendTo('body')
      .hide()
      .trigger('click')
      .on('change', (e) => {
        const body = new FormData();

        body.append(this.attrs.name, ($(e.target)[0] as HTMLInputElement).files![0]);

        this.loading = true;
        m.redraw();

        app
          .request<PollUploadObject>({
            method: 'POST',
            url: this.resourceUrl(),
            serialize: (raw: any) => raw,
            body,
          })
          .then(this.success.bind(this), this.failure.bind(this));
      });
  }

  remove(): void {
    this.loading = true;
    m.redraw();

    // Before the poll exists there is no id, so the file name addresses it.
    const fileName = !this.attrs.poll?.exists && !this.attrs.option?.exists ? this.fileName : undefined;

    app
      .request<PollUploadObject>({
        method: 'DELETE',
        url: this.resourceUrl(fileName),
      })
      .then((upload) => {
        this.attrs.poll?.exists && this.attrs.poll.pushAttributes({ image: null, imageUrl: null, isImageUpload: false });
        this.attrs.option?.exists && this.attrs.option.pushAttributes({ imageUrl: false });

        return upload;
      })
      .then(this.success.bind(this), this.failure.bind(this));
  }

  resourceUrl(fileName: string | undefined = undefined): string {
    let url = `${app.forum.attribute('apiUrl')}/polls/${this.attrs.name}`;

    if (fileName) return `${url}/name/${fileName}`;

    if (this.attrs.poll?.exists) url += `/${this.attrs.poll.id()}`;
    if (this.attrs.option?.exists) url += `/${this.attrs.option.id()}`;

    return url;
  }

  getImageUrl(): string | undefined | null {
    if (this.uploadedImageUrl !== false) return this.uploadedImageUrl;

    return this.attrs.poll?.imageUrl() || this.attrs.option?.imageUrl();
  }

  success(response: PollUploadObject | null): void {
    this.loading = false;
    this.uploadedImageUrl = response?.fileUrl;
    this.fileName = response?.fileName;

    if (response?.fileName) {
      this.attrs.poll?.exists && this.attrs.poll.pushAttributes({ image: response.fileName, imageUrl: response.fileUrl, isImageUpload: true });
      this.attrs.option?.exists &&
        this.attrs.option.pushAttributes({ imageUrl: response.fileUrl, image_url: response.fileName, isImageUpload: true });
    }

    this.attrs.onUpload?.(response?.fileName);

    m.redraw();
    this.$input?.remove();
  }

  failure(): void {
    this.loading = false;

    m.redraw();
    this.$input?.remove();
  }
}
