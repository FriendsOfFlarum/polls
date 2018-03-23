'use strict';

System.register('reflar/polls/helpers/sortByAttribute', [], function (_export, _context) {
    "use strict";

    _export('default', function (items) {
        var attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'sort';

        return items.sort(function (a, b) {
            return a[attr]() - b[attr]();
        });
    });

    return {
        setters: [],
        execute: function () {}
    };
});;
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
            icon: 'signal',
            label: 'Edit & Remove Polls',
            permission: 'discussion.polls'
          }, 95);
        });
      });
    }
  };
});;
'use strict';

System.register('reflar/polls/models/Answer', ['flarum/app', 'flarum/Model', 'flarum/utils/mixin', 'flarum/utils/computed'], function (_export, _context) {
    "use strict";

    var app, Model, mixin, computed, Answer;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }, function (_flarumUtilsComputed) {
            computed = _flarumUtilsComputed.default;
        }],
        execute: function () {
            Answer = function (_mixin) {
                babelHelpers.inherits(Answer, _mixin);

                function Answer() {
                    babelHelpers.classCallCheck(this, Answer);
                    return babelHelpers.possibleConstructorReturn(this, (Answer.__proto__ || Object.getPrototypeOf(Answer)).apply(this, arguments));
                }

                babelHelpers.createClass(Answer, [{
                    key: 'apiEndpoint',
                    value: function apiEndpoint() {
                        return '/reflar/polls/questions';
                    }
                }]);
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

System.register('reflar/polls/models/Question', ['flarum/app', 'flarum/Model', 'flarum/utils/mixin', 'flarum/utils/computed'], function (_export, _context) {
    "use strict";

    var app, Model, mixin, computed, Question;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }, function (_flarumUtilsComputed) {
            computed = _flarumUtilsComputed.default;
        }],
        execute: function () {
            Question = function (_mixin) {
                babelHelpers.inherits(Question, _mixin);

                function Question() {
                    babelHelpers.classCallCheck(this, Question);
                    return babelHelpers.possibleConstructorReturn(this, (Question.__proto__ || Object.getPrototypeOf(Question)).apply(this, arguments));
                }

                babelHelpers.createClass(Question, [{
                    key: 'apiEndpoint',
                    value: function apiEndpoint() {
                        return '/reflar/polls/questions';
                    }
                }]);
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

System.register('reflar/polls/models/Vote', ['flarum/app', 'flarum/Model', 'flarum/utils/mixin', 'flarum/utils/computed'], function (_export, _context) {
    "use strict";

    var app, Model, mixin, computed, Vote;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumModel) {
            Model = _flarumModel.default;
        }, function (_flarumUtilsMixin) {
            mixin = _flarumUtilsMixin.default;
        }, function (_flarumUtilsComputed) {
            computed = _flarumUtilsComputed.default;
        }],
        execute: function () {
            Vote = function (_mixin) {
                babelHelpers.inherits(Vote, _mixin);

                function Vote() {
                    babelHelpers.classCallCheck(this, Vote);
                    return babelHelpers.possibleConstructorReturn(this, (Vote.__proto__ || Object.getPrototypeOf(Vote)).apply(this, arguments));
                }

                babelHelpers.createClass(Vote, [{
                    key: 'apiEndpoint',
                    value: function apiEndpoint() {
                        return '/reflar/polls/votes';
                    }
                }]);
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