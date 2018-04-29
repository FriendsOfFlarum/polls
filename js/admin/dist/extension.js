'use strict';

System.register('reflar/polls/main', ['flarum/app', 'flarum/extend', 'flarum/components/PermissionGrid'], function (_export, _context) {
    "use strict";

    var app, extend, override, PermissionGrid;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumExtend) {
            extend = _flarumExtend.extend;
            override = _flarumExtend.override;
        }, function (_flarumComponentsPermissionGrid) {
            PermissionGrid = _flarumComponentsPermissionGrid.default;
        }],
        execute: function () {

            app.initializers.add('reflar-polls', function (app) {
                extend(PermissionGrid.prototype, 'moderateItems', function (items) {
                    items.add('reflar-polls', {
                        icon: 'pencil',
                        label: app.translator.trans('reflar-polls.admin.permissions.moderate'),
                        permission: 'discussion.polls'
                    }, 95);
                });
                extend(PermissionGrid.prototype, 'startItems', function (items) {
                    items.add('reflar-polls-start', {
                        icon: 'signal',
                        label: app.translator.trans('reflar-polls.admin.permissions.start'),
                        permission: 'startPolls'
                    }, 95);
                });
                extend(PermissionGrid.prototype, 'replyItems', function (items) {
                    items.add('reflar-polls-edit', {
                        icon: 'pencil',
                        label: app.translator.trans('reflar-polls.admin.permissions.self_edit'),
                        permission: 'selfEditPolls'
                    }, 70);
                    items.add('reflar-polls-vote', {
                        icon: 'signal',
                        label: app.translator.trans('reflar-polls.admin.permissions.vote'),
                        permission: 'votePolls'
                    }, 80);
                });
            });
        }
    };
});;
'use strict';

System.register('reflar/polls/models/Answer', ['flarum/Model', 'flarum/utils/mixin'], function (_export, _context) {
    "use strict";

    var Model, mixin, Answer;
    return {
        setters: [function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }],
        execute: function () {
            Answer = function (_mixin) {
                babelHelpers.inherits(Answer, _mixin);

                function Answer() {
                    babelHelpers.classCallCheck(this, Answer);
                    return babelHelpers.possibleConstructorReturn(this, (Answer.__proto__ || Object.getPrototypeOf(Answer)).apply(this, arguments));
                }

                return Answer;
            }(mixin(Model, {
                answer: Model.attribute('answer'),
                votes: Model.attribute('votes'),
                percent: Model.attribute('percent')
            }));

            _export('default', Answer);
        }
    };
});;
'use strict';

System.register('reflar/polls/models/Question', ['flarum/Model', 'flarum/utils/mixin'], function (_export, _context) {
    "use strict";

    var Model, mixin, Question;
    return {
        setters: [function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }],
        execute: function () {
            Question = function (_mixin) {
                babelHelpers.inherits(Question, _mixin);

                function Question() {
                    babelHelpers.classCallCheck(this, Question);
                    return babelHelpers.possibleConstructorReturn(this, (Question.__proto__ || Object.getPrototypeOf(Question)).apply(this, arguments));
                }

                return Question;
            }(mixin(Model, {
                question: Model.attribute('question'),
                answers: Model.hasMany('answers'),
                votes: Model.hasMany('votes')
            }));

            _export('default', Question);
        }
    };
});;
'use strict';

System.register('reflar/polls/models/Vote', ['flarum/Model', 'flarum/utils/mixin'], function (_export, _context) {
    "use strict";

    var Model, mixin, Vote;
    return {
        setters: [function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }],
        execute: function () {
            Vote = function (_mixin) {
                babelHelpers.inherits(Vote, _mixin);

                function Vote() {
                    babelHelpers.classCallCheck(this, Vote);
                    return babelHelpers.possibleConstructorReturn(this, (Vote.__proto__ || Object.getPrototypeOf(Vote)).apply(this, arguments));
                }

                return Vote;
            }(mixin(Model, {
                poll_id: Model.attribute('poll_id'),
                user_id: Model.attribute('user_id'),
                option_id: Model.attribute('option_id')
            }));

            _export('default', Vote);
        }
    };
});