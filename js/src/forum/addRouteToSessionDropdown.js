import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import Acl from '../common/Acl';
import SessionDropdown from 'flarum/forum/components/SessionDropdown';
import LinkButton from 'flarum/common/components/LinkButton';

export default () => {
	extend(SessionDropdown.prototype, 'items', (items) => {
		if (Acl.canStartPoll() && m.route.get()) {
			items.add(
				'fof-polls-directory',
				<LinkButton
					href={app.route('fof_polls_list')}
					icon='fas fa-poll'
					active={m.route.get().indexOf('/polls') === 0}>
					{app.translator.trans('fof-polls.forum.page.nav')}
				</LinkButton>,
				10,
			);
		}
	});
};