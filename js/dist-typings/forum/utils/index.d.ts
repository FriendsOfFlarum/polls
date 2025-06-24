/// <reference types="mithril" />
export declare const utils: {
    PollControls: {
        controls(poll: import("../models/Poll").default, context: import("flarum/common/Component").default<import("flarum/common/Component").ComponentAttrs, undefined>): import("flarum/common/utils/ItemList").default<import("mithril").Children>;
        pollControls(poll: import("../models/Poll").default, context: import("flarum/common/Component").default<import("flarum/common/Component").ComponentAttrs, undefined>): import("flarum/common/utils/ItemList").default<import("mithril").Children>;
        moderationControls(poll: import("../models/Poll").default, context: import("flarum/common/Component").default<import("flarum/common/Component").ComponentAttrs, undefined>): import("flarum/common/utils/ItemList").default<import("mithril").Children>;
        destructiveControls(poll: import("../models/Poll").default, context: import("flarum/common/Component").default<import("flarum/common/Component").ComponentAttrs, undefined>): import("flarum/common/utils/ItemList").default<import("mithril").Children>;
        deleteAction(poll: import("../models/Poll").default): Promise<void>;
        showDeletionAlert(poll: import("../models/Poll").default, type: string): void;
        editAction(poll: import("../models/Poll").default): void;
    };
    PollGroupControls: {
        controls(pollGroup: import("../models/PollGroup").default, context: import("flarum/common/Component").default<import("flarum/common/Component").ComponentAttrs, undefined>): import("flarum/common/utils/ItemList").default<import("mithril").Children>;
        moderationControls(pollGroup: import("../models/PollGroup").default, context: import("flarum/common/Component").default<import("flarum/common/Component").ComponentAttrs, undefined>): import("flarum/common/utils/ItemList").default<import("mithril").Children>;
        destructiveControls(pollGroup: import("../models/PollGroup").default, context: import("flarum/common/Component").default<import("flarum/common/Component").ComponentAttrs, undefined>): import("flarum/common/utils/ItemList").default<import("mithril").Children>;
        deleteAction(pollGroup: import("../models/PollGroup").default): Promise<void>;
        showDeletionAlert(pollGroup: import("../models/PollGroup").default, type: string): void;
        editAction(pollGroup: import("../models/PollGroup").default): void;
        addPoll(pollGroup: import("../models/PollGroup").default): void;
    };
};
