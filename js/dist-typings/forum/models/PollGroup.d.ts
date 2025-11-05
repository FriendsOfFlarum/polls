import Model from 'flarum/common/Model';
import Poll from './Poll';
export default class PollGroup extends Model {
    name(): string;
    createdAt(): Date | null | undefined;
    polls(): (Poll | undefined)[] | null;
    canEdit(): boolean;
    canDelete(): boolean;
    apiEndpoint(): string;
}
