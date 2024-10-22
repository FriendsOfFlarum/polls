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
};
