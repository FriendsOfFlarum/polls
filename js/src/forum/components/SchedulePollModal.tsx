import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import Mithril from 'mithril';

// Stub created for Task 15 — full implementation in Task 16.
interface SchedulePollModalAttrs extends IInternalModalAttrs {
  poll: any;
  form: any;
}

export default class SchedulePollModal extends Modal<SchedulePollModalAttrs> {
  className() {
    return 'SchedulePollModal Modal--small';
  }
  title(): Mithril.Children {
    return 'Schedule poll';
  }
  content(): Mithril.Children {
    return null;
  }
}
