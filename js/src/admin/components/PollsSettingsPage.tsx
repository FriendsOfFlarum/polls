import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import ItemList from 'flarum/common/utils/ItemList';
import Mithril from 'mithril';

export default class PollsSettingsPage extends ExtensionPage {
  content() {
    return (
      <div className="PollsSettingsPage">
        <div className="container">
          <div className="PollsSettingsTabPage PollsSettingsPage--settings">
            <div className="Form">
              {this.settingsItems().toArray()}
              <div className="Form-group">{this.submitButton()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  settingsItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'general',
      <div className="Section">
        <h3>{app.translator.trans('fof-polls.admin.settings.general.heading')}</h3>
        <p className="helpText">{app.translator.trans('fof-polls.admin.settings.general.help')}</p>
        {this.generalItems().toArray()}
      </div>
    );

    items.add(
      'globalPolls',
      <div className="Section">
        <h3>{app.translator.trans('fof-polls.admin.settings.global_polls.heading')}</h3>
        <p className="helpText">{app.translator.trans('fof-polls.admin.settings.global_polls.help')}</p>
        {this.globalPollsItems().toArray()}
      </div>
    );

    items.add(
      'image',
      <div className="Section">
        <h3>{app.translator.trans('fof-polls.admin.settings.image.heading')}</h3>
        <p className="helpText">{app.translator.trans('fof-polls.admin.settings.image.help')}</p>
        {this.imageItems().toArray()}
      </div>
    );

    return items;
  }

  generalItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'colorBlend',
      this.buildSettingComponent({
        setting: 'fof-polls.optionsColorBlend',
        type: 'switch',
        label: app.translator.trans('fof-polls.admin.settings.options_color_blend'),
        help: app.translator.trans('fof-polls.admin.settings.options_color_blend_help'),
      })
    );

    items.add(
      'maxOptions',
      this.buildSettingComponent({
        setting: 'fof-polls.maxOptions',
        type: 'number',
        label: app.translator.trans('fof-polls.admin.settings.max_options'),
        min: 2,
      })
    );

    return items;
  }

  globalPollsItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'enableGlobalPolls',
      this.buildSettingComponent({
        setting: 'fof-polls.enableGlobalPolls',
        type: 'boolean',
        label: app.translator.trans('fof-polls.admin.settings.enable_global_polls'),
        help: app.translator.trans('fof-polls.admin.settings.enable_global_polls_help'),
      })
    );

    items.add(
      'enabledPollGroups',
      this.buildSettingComponent({
        setting: 'fof-polls.enablePollGroups',
        type: 'boolean',
        label: app.translator.trans('fof-polls.admin.settings.enabled_poll_groups'),
        help: app.translator.trans('fof-polls.admin.settings.enabled_poll_groups_help'),
        disabled: this.setting('fof-polls.enableGlobalPolls')() === false,
      })
    );

    this.onsaved = () => {
      this.loading = false;

      app.alerts.show({ type: 'success' }, app.translator.trans('core.admin.settings.saved_message'));

      items.setContent(
        'enabledPollGroups',
        this.buildSettingComponent({
          setting: 'fof-polls.enablePollGroups',
          type: 'boolean',
          label: app.translator.trans('fof-polls.admin.settings.enabled_poll_groups'),
          help: app.translator.trans('fof-polls.admin.settings.enabled_poll_groups_help'),
          disabled: this.setting('fof-polls.enableGlobalPolls')() === false,
        })
      );

      m.redraw();
    };

    return items;
  }

  imageItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'allowOptionImage',
      this.buildSettingComponent({
        setting: 'fof-polls.allowOptionImage',
        type: 'switch',
        label: app.translator.trans('fof-polls.admin.settings.allow_option_image'),
      })
    );

    items.add(
      'allowImageUploads',
      this.buildSettingComponent({
        setting: 'fof-polls.allowImageUploads',
        type: 'switch',
        label: app.translator.trans('fof-polls.admin.settings.allow_image_uploads'),
        help: app.translator.trans('fof-polls.admin.settings.allow_image_uploads_help'),
      })
    );

    items.add(
      'imageHeight',
      this.buildSettingComponent({
        setting: 'fof-polls.image_height',
        type: 'number',
        label: app.translator.trans('fof-polls.admin.settings.image_height'),
      })
    );

    items.add(
      'imageWidth',
      this.buildSettingComponent({
        setting: 'fof-polls.image_width',
        type: 'number',
        label: app.translator.trans('fof-polls.admin.settings.image_width'),
      })
    );

    return items;
  }
}
