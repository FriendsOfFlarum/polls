import type Poll from '../forum/models/Poll';

declare module 'flarum/common/models/Post' {
  export default interface Post {
    polls: () => Poll[];
  }
}
