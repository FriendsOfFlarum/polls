import { ModelAttributes } from 'flarum/common/Model';

export default interface PollModelAttributes extends ModelAttributes {
  options: ModelAttributes[];
}
