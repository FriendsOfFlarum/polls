import app from 'flarum/forum/app';
import Model from 'flarum/common/Model';
import User from 'flarum/common/Model';
import computed from 'flarum/common/utils/computed';

export default class Poll extends Model {
  title() {
    return Model.attribute<string>('title').call(this);
  }
  slug() {
    return Model.attribute<string>('slug').call(this);
  }

  createdAt() {
    return Model.attribute<Date | undefined, string | undefined>('createdAt', Model.transformDate).call(this);
  }
  user() {
    return Model.hasOne<User | null>('user').call(this);
  }

  voteCount() {
    return Model.attribute<number>('voteCount').call(this);
  }

  // TODO: These two don't make sense as of now
  isUnread() {
    return computed<boolean, this>('unreadCount', (unreadCount) => !!unreadCount).call(this);
  }
  isRead() {
    return computed<boolean, this>('unreadCount', (unreadCount) => !!(app.session.user && !unreadCount)).call(this);
  }

  hiddenAt() {
    return Model.attribute('hiddenAt', Model.transformDate).call(this);
  }
  hiddenUser() {
    return Model.hasOne<User | null>('hiddenUser').call(this);
  }
  isHidden() {
    return computed<boolean, this>('hiddenAt', (hiddenAt) => !!hiddenAt).call(this);
  }

  canVote() {
    return Model.attribute<boolean | undefined>('canVote').call(this);
  }
  canRename() {
    return Model.attribute<boolean | undefined>('canRename').call(this);
  }
  canHide() {
    return Model.attribute<boolean | undefined>('canHide').call(this);
  }
  canDelete() {
    return Model.attribute<boolean | undefined>('canDelete').call(this);
  }
}
