import SettingsModal from 'flarum/components/SettingsModal';

export default class PollsSettingsModal extends SettingsModal {
    className() {
        return 'PollsSettingsModal Modal--small';
    }

    title() {
        return app.translator.trans('fof-polls.admin.settings.title');
    }

    form() {
        return [
            <div className="Form-group">
                <label>{app.translator.trans('fof-polls.admin.settings.first_day_of_week')}</label>
                <input className="FormControl"
                    type="number"
                    min="0"
                    max="6"
                    bidi={this.setting('fof-polls.first_day_of_week', 0)}
                />
            </div>
        ];
    }
}