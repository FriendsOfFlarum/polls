import app from 'flarum/app';
import { extend, override } from 'flarum/extend';

import PermissionGrid from 'flarum/components/PermissionGrid';

app.initializers.add('reflar-polls', app => {
  extend(PermissionGrid.prototype, 'moderateItems', items => {
    items.add('reflar-polls', {
      icon: 'signal',
      label: 'Edit & Remove Polls',
      permission: 'edit.polls'
    }, 95);
  });
});
