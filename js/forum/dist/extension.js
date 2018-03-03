'use strict';

System.register('treefiction/polls/components/PollModal', ['flarum/extend', 'flarum/components/Modal', 'flarum/components/DiscussionPage', 'flarum/components/Button', 'flarum/helpers/highlight', 'flarum/utils/classList', 'flarum/components/DiscussionComposer'], function (_export, _context) {
  "use strict";

  var extend, override, Modal, DiscussionPage, Button, highlight, classList, DiscussionComposer, PollModal;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
      override = _flarumExtend.override;
    }, function (_flarumComponentsModal) {
      Modal = _flarumComponentsModal.default;
    }, function (_flarumComponentsDiscussionPage) {
      DiscussionPage = _flarumComponentsDiscussionPage.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumHelpersHighlight) {
      highlight = _flarumHelpersHighlight.default;
    }, function (_flarumUtilsClassList) {
      classList = _flarumUtilsClassList.default;
    }, function (_flarumComponentsDiscussionComposer) {
      DiscussionComposer = _flarumComponentsDiscussionComposer.default;
    }],
    execute: function () {
      PollModal = function (_Modal) {
        babelHelpers.inherits(PollModal, _Modal);

        function PollModal() {
          babelHelpers.classCallCheck(this, PollModal);
          return babelHelpers.possibleConstructorReturn(this, (PollModal.__proto__ || Object.getPrototypeOf(PollModal)).apply(this, arguments));
        }

        babelHelpers.createClass(PollModal, [{
          key: 'init',
          value: function init() {
            babelHelpers.get(PollModal.prototype.__proto__ || Object.getPrototypeOf(PollModal.prototype), 'init', this).call(this);

            this.question = m.prop(this.props.question || '');
            this.answer = [];
            this.answer[1] = m.prop('');
            this.answer[2] = m.prop('');
          }
        }, {
          key: 'className',
          value: function className() {
            return 'PollDiscussionModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return 'Add a poll';
          }
        }, {
          key: 'choicePlaceholder',
          value: function choicePlaceholder(number) {
            return 'Choice ' + number;
          }
        }, {
          key: 'addOption',
          value: function addOption() {
            if (this.answer.length < 11) {
              this.answer.push(m.prop(''));
            }
          }
        }, {
          key: 'removeOption',
          value: function removeOption(option) {
            delete this.answer[option];
          }
        }, {
          key: 'content',
          value: function content() {
            var _this2 = this;

            return [m(
              'div',
              { className: 'Modal-body' },
              m(
                'div',
                { className: 'PollDiscussionModal-form' },
                m(
                  'div',
                  null,
                  m(
                    'fieldset',
                    null,
                    m('input', { type: 'text', name: 'question', className: 'FormControl', bidi: this.question, placeholder: 'Ask a question' })
                  )
                ),
                m(
                  'h4',
                  null,
                  'Answers'
                ),
                Object.keys(this.answer).map(function (el, i) {
                  return m(
                    'div',
                    { 'class': 'Form-group' },
                    m(
                      'fieldset',
                      null,
                      m('input', { className: 'FormControl',
                        type: 'text',
                        name: 'answer' + (i + 1),
                        bidi: _this2.answer[i + 1],
                        placeholder: _this2.choicePlaceholder(i + 1) })
                    ),
                    i + 1 >= 3 ? m(
                      'a',
                      { href: 'javascript:;', className: 'Option-remove', onclick: _this2.removeOption.bind(_this2, i + 1) },
                      m(
                        'span',
                        { 'class': 'TagLabel untagged' },
                        'Remove option'
                      )
                    ) : ''
                  );
                }),
                m(
                  'a',
                  { href: 'javascript:;', onclick: this.addOption.bind(this) },
                  m(
                    'span',
                    { 'class': 'TagLabel untagged' },
                    '+ Add an option'
                  )
                ),
                m('br', null),
                m('br', null),
                Button.component({
                  type: 'submit',
                  className: 'Button Button--primary',
                  children: 'Submit'
                })
              )
            )];
          }
        }, {
          key: 'onsubmit',
          value: function onsubmit(e) {
            var _this3 = this;

            e.preventDefault();

            var pollArray = {
              question: this.question(),
              answers: {}
            };

            // Add answers to PollArray
            Object.keys(this.answer).map(function (el, i) {
              var key = i + 1;
              pollArray['answers'][key] = _this3.answer[key]();
            });

            // Add data to DiscussionComposer post data
            extend(DiscussionComposer.prototype, 'data', function (data) {
              data.poll = pollArray;
            });

            // Change the text of add poll button to edit poll
            if (this.question() != '') {
              extend(DiscussionComposer.prototype, 'headerItems', function (items) {
                items.replace('polls', m(
                  'a',
                  { className: 'DiscussionComposer-changeTags', onclick: this.addPoll },
                  m(
                    'span',
                    { className: 'TagLabel' },
                    'Edit poll'
                  )
                ), 1);
              });
            }

            app.modal.close();

            m.redraw.strategy('none');
          }
        }]);
        return PollModal;
      }(Modal);

      _export('default', PollModal);
    }
  };
});;
'use strict';

System.register('treefiction/polls/components/PollVote', ['flarum/extend', 'flarum/utils/ItemList', 'flarum/Component', 'flarum/utils/classList'], function (_export, _context) {
  "use strict";

  var extend, override, ItemList, Component, classList, PollVote;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
      override = _flarumExtend.override;
    }, function (_flarumUtilsItemList) {
      ItemList = _flarumUtilsItemList.default;
    }, function (_flarumComponent) {
      Component = _flarumComponent.default;
    }, function (_flarumUtilsClassList) {
      classList = _flarumUtilsClassList.default;
    }],
    execute: function () {
      PollVote = function (_Component) {
        babelHelpers.inherits(PollVote, _Component);

        function PollVote() {
          babelHelpers.classCallCheck(this, PollVote);
          return babelHelpers.possibleConstructorReturn(this, (PollVote.__proto__ || Object.getPrototypeOf(PollVote)).apply(this, arguments));
        }

        babelHelpers.createClass(PollVote, [{
          key: 'init',
          value: function init() {
            var _this2 = this;

            this.poll = this.props.poll;
            this.votes = [];
            this.voted = false;
            this.answers = this.poll ? this.poll.answers() : [];

            if (app.session.user != undefined) {
              app.store.find('treefiction/polls/votes', {
                poll_id: this.poll.id(),
                user_id: app.session.user.id()
              }).then(function (data) {
                if (data[0] != undefined) {
                  _this2.voted = true;
                }

                m.redraw();
              });
            } else {
              this.voted = true;
            }
          }
        }, {
          key: 'voteView',
          value: function voteView() {
            var _this3 = this;

            if (this.voted) {
              return m(
                'div',
                null,
                m(
                  'h4',
                  null,
                  this.poll.question()
                ),
                this.answers.map(function (item, index) {
                  return m(
                    'div',
                    { className: 'PollOption PollVoted' },
                    m(
                      'div',
                      { 'class': 'PollPercent' },
                      item.percent(),
                      '%'
                    ),
                    m(
                      'div',
                      { className: 'PollBar' },
                      m('div', { style: 'width: ' + item.percent() + '%;', className: 'PollOption-active' }),
                      m(
                        'label',
                        null,
                        m(
                          'span',
                          null,
                          item.answer()
                        )
                      )
                    )
                  );
                }),
                m('div', { 'class': 'clear' })
              );
            } else {
              return m(
                'div',
                null,
                m(
                  'h4',
                  null,
                  this.poll.question()
                ),
                this.answers.map(function (item, index) {
                  return m(
                    'div',
                    { 'class': 'PollOption' },
                    m(
                      'div',
                      { className: 'PollBar' },
                      m(
                        'label',
                        { 'class': 'checkbox' },
                        m('input', { type: 'checkbox', onchange: _this3.addVote.bind(_this3, item.id()) }),
                        m(
                          'span',
                          null,
                          item.answer()
                        ),
                        m('span', { 'class': 'checkmark' })
                      )
                    )
                  );
                }),
                m('div', { 'class': 'clear' })
              );
            }
          }
        }, {
          key: 'view',
          value: function view() {
            var content = this.voteView();

            return m(
              'div',
              { className: classList({
                  voted: this.voted
                }) },
              content
            );
          }
        }, {
          key: 'addVote',
          value: function addVote(answer) {
            app.store.createRecord('treefiction-polls-vote').save({
              poll_id: this.poll.id(),
              user_id: app.session.user.id(),
              option_id: answer
            });

            location.reload();

            m.redraw();
          }
        }]);
        return PollVote;
      }(Component);

      _export('default', PollVote);
    }
  };
});;
'use strict';

System.register('treefiction/polls/helpers/sortByAttribute', [], function (_export, _context) {
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

System.register('treefiction/polls/main', ['flarum/app', 'flarum/extend', 'flarum/components/DiscussionComposer', 'flarum/Model', 'treefiction/polls/models/Question', 'treefiction/polls/models/Answer', 'treefiction/polls/models/Vote', 'flarum/models/Discussion', 'treefiction/polls/PollControl', 'treefiction/polls/PollDiscussion', 'treefiction/polls/components/PollModal'], function (_export, _context) {
  "use strict";

  var app, extend, override, DiscussionComposer, Model, Question, Answer, Vote, Discussion, PollControl, PollDiscussion, PollModal;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumExtend) {
      extend = _flarumExtend.extend;
      override = _flarumExtend.override;
    }, function (_flarumComponentsDiscussionComposer) {
      DiscussionComposer = _flarumComponentsDiscussionComposer.default;
    }, function (_flarumModel) {
      Model = _flarumModel.default;
    }, function (_treefictionPollsModelsQuestion) {
      Question = _treefictionPollsModelsQuestion.default;
    }, function (_treefictionPollsModelsAnswer) {
      Answer = _treefictionPollsModelsAnswer.default;
    }, function (_treefictionPollsModelsVote) {
      Vote = _treefictionPollsModelsVote.default;
    }, function (_flarumModelsDiscussion) {
      Discussion = _flarumModelsDiscussion.default;
    }, function (_treefictionPollsPollControl) {
      PollControl = _treefictionPollsPollControl.default;
    }, function (_treefictionPollsPollDiscussion) {
      PollDiscussion = _treefictionPollsPollDiscussion.default;
    }, function (_treefictionPollsComponentsPollModal) {
      PollModal = _treefictionPollsComponentsPollModal.default;
    }],
    execute: function () {

      app.initializers.add('treefiction-polls', function (app) {
        // Relationships
        app.store.models['treefiction-polls-answer'] = Answer;
        app.store.models['treefiction-polls-question'] = Question;
        app.store.models['treefiction-polls-vote'] = Vote;

        Discussion.prototype.treefictionPolls = Model.hasOne('treefictionPolls');

        var pollModal = new PollModal();

        DiscussionComposer.prototype.addPoll = function () {
          app.modal.show(pollModal);
        };

        // Add button to DiscussionComposer header
        extend(DiscussionComposer.prototype, 'headerItems', function (items) {
          items.add('polls', m(
            'a',
            { className: 'DiscussionComposer-changeTags', onclick: this.addPoll },
            m(
              'span',
              { className: 'TagLabel' },
              'Add poll'
            )
          ), 1);
        });

        PollDiscussion();
        PollControl();
      });
    }
  };
});;
'use strict';

System.register('treefiction/polls/models/Answer', ['flarum/app', 'flarum/Model', 'flarum/utils/mixin', 'flarum/utils/computed'], function (_export, _context) {
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
                        return '/treefiction/polls/questions';
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

System.register('treefiction/polls/models/Question', ['flarum/app', 'flarum/Model', 'flarum/utils/mixin', 'flarum/utils/computed'], function (_export, _context) {
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
                        return '/treefiction/polls/questions';
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

System.register('treefiction/polls/models/Vote', ['flarum/app', 'flarum/Model', 'flarum/utils/mixin', 'flarum/utils/computed'], function (_export, _context) {
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
                        return '/treefiction/polls/votes';
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
});;
'use strict';

System.register('treefiction/polls/PollControl', ['flarum/extend', 'flarum/utils/PostControls', 'flarum/components/Button'], function (_export, _context) {
  "use strict";

  var extend, override, PostControls, Button;

  _export('default', function () {
    extend(PostControls, 'moderationControls', function (items, post) {
      var discussion = post.discussion();

      items.add('editPoll', [m(Button, {
        icon: 'check-square',
        className: 'treefiction-PollButton',
        onclick: function onclick() {
          // app.modal.show(new PollModal({post}));
        }
      }, 'Edit Poll')]);
    });
  });

  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
      override = _flarumExtend.override;
    }, function (_flarumUtilsPostControls) {
      PostControls = _flarumUtilsPostControls.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }],
    execute: function () {}
  };
});;
'use strict';

System.register('treefiction/polls/PollDiscussion', ['flarum/extend', 'flarum/components/CommentPost', 'treefiction/polls/components/PollVote'], function (_export, _context) {
  "use strict";

  var extend, override, CommentPost, PollVote;

  _export('default', function () {
    extend(CommentPost.prototype, 'content', function (content) {
      var discussion = this.props.post.discussion();

      if (discussion.treefictionPolls() && this.props.post.number() == 1 && !this.props.post.isHidden()) {
        this.subtree.invalidate();

        content.push(PollVote.component({
          poll: discussion.treefictionPolls()
        }));
      }
    });
  });

  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
      override = _flarumExtend.override;
    }, function (_flarumComponentsCommentPost) {
      CommentPost = _flarumComponentsCommentPost.default;
    }, function (_treefictionPollsComponentsPollVote) {
      PollVote = _treefictionPollsComponentsPollVote.default;
    }],
    execute: function () {}
  };
});