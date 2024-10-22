import Button, { IButtonAttrs } from 'flarum/common/components/Button';
import Mithril from 'mithril';
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
    loading: boolean;
    uploadedImageUrl: string | undefined | false;
    fileName: string | undefined;
    $input: JQuery<HTMLElement> | undefined;
    view(vnode: Mithril.Vnode<UploadPollImageButtonAttrs>): false | JSX.Element;
    /**
     * Prompt the user to upload an image.
     */
    upload(): void;
    /**
     * Remove the image.
     */
    remove(): void;
    resourceUrl(fileName?: string | undefined): string;
    getImageUrl(): string | null | undefined;
    /**
     * After a successful upload/removal, redraw the page.
     *
     * @param {PollUploadObject} response
     * @protected
     */
    success(response: PollUploadObject | null): void;
    /**
     * If upload/removal fails, stop loading.
     *
     * @param {object} response
     * @protected
     */
    failure(response: object): void;
}
