import type Mithril from 'mithril';
import Component from 'flarum/common/Component';
import { IButtonAttrs } from 'flarum/common/components/Button';
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
export default class UploadPollImageButton<CustomAttrs extends IUploadPollImageButtonAttrs = IUploadPollImageButtonAttrs> extends Component<CustomAttrs> {
    loading: boolean;
    uploadedImageUrl: string | undefined | false;
    fileName: string | undefined;
    $input: JQuery<HTMLElement> | undefined;
    view(vnode: Mithril.Vnode<CustomAttrs, this>): JSX.Element;
    imageAlt(): string;
    upload(): void;
    remove(): void;
    resourceUrl(fileName?: string | undefined): string;
    getImageUrl(): string | undefined | null;
    success(response: PollUploadObject | null): void;
    failure(): void;
}
