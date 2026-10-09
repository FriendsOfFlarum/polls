import type Mithril from 'mithril';
import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import FieldSet from 'flarum/common/components/FieldSet';
import Form from 'flarum/common/components/Form';
import ItemList from 'flarum/common/utils/ItemList';
import extractText from 'flarum/common/utils/extractText';

export default class PollsSettingsPage extends ExtensionPage {
  content() {
    return (
      <div className="ExtensionPage-settings PollsSettingsPage">
        <div className="container">
          <Form>
            {this.settingsItems().toArray()}
            <div className="Form-group Form-controls">
              {this.submitButton()}
              {this.resetButton(
                undefined,
                extractText(
                  app.translator.trans('core.admin.extension.reset_settings.title_extension', {
                    extensionTitle: this.extension.extra['flarum-extension'].title,
                  })
                ),
                this.extension.id
              )}
            </div>
          </Form>
        </div>
      </div>
    );
  }

  settingsItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add('general', this.section('general', this.generalItems()), 100);
    items.add('discussionPolls', this.section('discussion_polls', this.discussionPollsItems()), 90);
    items.add('globalPolls', this.section('global_polls', this.globalPollsItems()), 80);
    items.add('image', this.section('image', this.imageItems()), 70);

    return items;
  }

  section(key: string, items: ItemList<Mithril.Children>): Mithril.Children {
    return (
      <FieldSet
        className="FieldSet--form PollsSettingsPage-section"
        label={extractText(app.translator.trans(`fof-polls.admin.settings.${key}.heading`))}
        description={extractText(app.translator.trans(`fof-polls.admin.settings.${key}.help`))}
      >
        {items.toArray()}
      </FieldSet>
    );
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
      }),
      100
    );

    items.add(
      'maxOptions',
      this.buildSettingComponent({
        setting: 'fof-polls.maxOptions',
        type: 'number',
        label: app.translator.trans('fof-polls.admin.settings.max_options'),
        min: 2,
      }),
      90
    );

    return items;
  }

  discussionPollsItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'enableDiscussionPolls',
      this.buildSettingComponent({
        setting: 'fof-polls.enableDiscussionPolls',
        type: 'switch',
        label: app.translator.trans('fof-polls.admin.settings.enable_discussion_polls'),
        help: app.translator.trans('fof-polls.admin.settings.enable_discussion_polls_help'),
      })
    );

    return items;
  }

  globalPollsItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    // Settings are strings, so '0' is off.
    const globalPolls = this.setting('fof-polls.enableGlobalPolls')();

    items.add(
      'enableGlobalPolls',
      this.buildSettingComponent({
        setting: 'fof-polls.enableGlobalPolls',
        type: 'switch',
        label: app.translator.trans('fof-polls.admin.settings.enable_global_polls'),
        help: app.translator.trans('fof-polls.admin.settings.enable_global_polls_help'),
      }),
      100
    );

    items.add(
      'enabledPollGroups',
      this.buildSettingComponent({
        setting: 'fof-polls.enablePollGroups',
        type: 'switch',
        label: app.translator.trans('fof-polls.admin.settings.enabled_poll_groups'),
        help: app.translator.trans('fof-polls.admin.settings.enabled_poll_groups_help'),
        disabled: !globalPolls || globalPolls === '0',
      }),
      90
    );

    return items;
  }

  imageItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'maxImageUploadSize',
      this.buildSettingComponent({
        setting: 'fof-polls.maxImageUploadSize',
        type: 'number',
        label: app.translator.trans('fof-polls.admin.settings.max_image_upload_size'),
        help: app.translator.trans('fof-polls.admin.settings.max_image_upload_size_help'),
        min: 1,
      }),
      100
    );

    items.add(
      'imageWidth',
      this.buildSettingComponent({
        setting: 'fof-polls.image_width',
        type: 'number',
        label: app.translator.trans('fof-polls.admin.settings.image_width'),
        min: 1,
      }),
      90
    );

    items.add(
      'imageHeight',
      this.buildSettingComponent({
        setting: 'fof-polls.image_height',
        type: 'number',
        label: app.translator.trans('fof-polls.admin.settings.image_height'),
        help: app.translator.trans('fof-polls.admin.settings.image_dimensions_help'),
        min: 1,
      }),
      80
    );

    return items;
  }
}
