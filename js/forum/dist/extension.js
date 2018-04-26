'use strict';

System.register('reflar/polls/components/EditPollModal', ['flarum/extend', 'flarum/components/Modal', 'flarum/components/Button'], function (_export, _context) {
    "use strict";

    var extend, override, Modal, Button, EditPollModal;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
            override = _flarumExtend.override;
        }, function (_flarumComponentsModal) {
            Modal = _flarumComponentsModal.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
        }],
        execute: function () {
            EditPollModal = function (_Modal) {
                babelHelpers.inherits(EditPollModal, _Modal);

                function EditPollModal() {
                    babelHelpers.classCallCheck(this, EditPollModal);
                    return babelHelpers.possibleConstructorReturn(this, (EditPollModal.__proto__ || Object.getPrototypeOf(EditPollModal)).apply(this, arguments));
                }

                babelHelpers.createClass(EditPollModal, [{
                    key: 'init',
                    value: function init() {
                        babelHelpers.get(EditPollModal.prototype.__proto__ || Object.getPrototypeOf(EditPollModal.prototype), 'init', this).call(this);
                        this.answers = this.props.poll.answers();

                        this.question = m.prop(this.props.poll.question());

                        this.newAnswer = m.prop('');
                    }
                }, {
                    key: 'className',
                    value: function className() {
                        return 'PollDiscussionModal Modal--small';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        return 'Edit poll';
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
                                        m('input', { type: 'text', name: 'question', className: 'FormControl', value: this.question(), oninput: m.withAttr('value', this.updateQuestion.bind(this)), placeholder: 'Ask a question' })
                                    )
                                ),
                                m(
                                    'h4',
                                    null,
                                    'Answers'
                                ),
                                this.answers.map(function (answer, i) {
                                    return m(
                                        'div',
                                        { className: 'Form-group' },
                                        m(
                                            'fieldset',
                                            { className: 'Poll-answer-input' },
                                            m('input', { className: 'FormControl',
                                                type: 'text',
                                                oninput: m.withAttr('value', _this2.updateAnswer.bind(_this2, answer)),
                                                value: answer.data.attributes.answer,
                                                placeholder: _this2.choicePlaceholder() })
                                        ),
                                        i + 1 >= 3 ? Button.component({
                                            type: 'button',
                                            className: 'Button Button--warning Poll-answer-button',
                                            icon: 'minus',
                                            onclick: i + 1 >= 3 ? _this2.removeOption.bind(_this2, answer) : ''
                                        }) : '',
                                        m('div', { className: 'clear' })
                                    );
                                }),
                                m(
                                    'div',
                                    { className: 'Form-group' },
                                    m(
                                        'fieldset',
                                        { className: 'Poll-answer-input' },
                                        m('input', { className: 'FormControl',
                                            type: 'text',
                                            oninput: m.withAttr('value', this.newAnswer),
                                            placeholder: this.choicePlaceholder() })
                                    ),
                                    Button.component({
                                        type: 'button',
                                        className: 'Button Button--warning Poll-answer-button',
                                        icon: 'plus',
                                        onclick: this.addAnswer.bind(this)
                                    }),
                                    m('div', { className: 'clear' })
                                )
                            )
                        )];
                    }
                }, {
                    key: 'choicePlaceholder',
                    value: function choicePlaceholder() {
                        return 'Option';
                    }
                }, {
                    key: 'addAnswer',
                    value: function addAnswer(answer) {
                        var _this3 = this;

                        if (this.answers.length < 11) {
                            app.request({
                                method: 'POST',
                                url: app.forum.attribute('apiUrl') + '/answers',
                                data: {
                                    answer: this.newAnswer(),
                                    poll_id: this.props.poll.id()
                                }
                            }).then(function (response) {
                                _this3.answers.push(response);

                                _this3.newAnswer('');
                                m.redraw();
                            });
                        } else {
                            alert('You can have a maximum of 10 answers');
                        }
                    }
                }, {
                    key: 'removeOption',
                    value: function removeOption(option) {
                        var _this4 = this;

                        app.request({
                            method: 'DELETE',
                            url: app.forum.attribute('apiUrl') + '/answers/' + option.id()
                        });
                        this.answers.some(function (answer, i) {
                            if (answer.id() === option.id()) {
                                _this4.answers.splice(i, 1);
                                return true;
                            }
                        });
                    }
                }, {
                    key: 'updateAnswer',
                    value: function updateAnswer(answerToUpdate, value) {
                        if (value === '') {
                            alert('You must include a question');
                            return;
                        }
                        app.request({
                            method: 'PATCH',
                            url: app.forum.attribute('apiUrl') + '/answers/' + answerToUpdate.id(),
                            data: value
                        });
                        this.answers.some(function (answer) {
                            if (answer.id() === answerToUpdate.id()) {
                                answer.data.attributes.answer = value;
                                return true;
                            }
                        });
                    }
                }, {
                    key: 'updateQuestion',
                    value: function updateQuestion(question) {
                        app.request({
                            method: 'PATCH',
                            url: app.forum.attribute('apiUrl') + '/questions/' + this.props.poll.id(),
                            data: question
                        });
                        this.question = m.prop(question);
                        m.redraw();
                    }
                }]);
                return EditPollModal;
            }(Modal);

            _export('default', EditPollModal);
        }
    };
});;
'use strict';

System.register('reflar/polls/components/PollModal', ['flarum/extend', 'flarum/components/Modal', 'flarum/components/Button', 'flarum/components/DiscussionComposer'], function (_export, _context) {
    "use strict";

    var extend, override, Modal, Button, DiscussionComposer, PollModal;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
            override = _flarumExtend.override;
        }, function (_flarumComponentsModal) {
            Modal = _flarumComponentsModal.default;
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton.default;
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
                        this.answer = [];

                        this.question = m.prop(this.props.question || '');
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
                                        { className: _this2.answer[i + 1] === '' ? 'Form-group hide' : 'Form-group' },
                                        m(
                                            'fieldset',
                                            { className: 'Poll-answer-input' },
                                            m('input', { className: 'FormControl',
                                                type: 'text',
                                                name: 'answer' + (i + 1),
                                                bidi: _this2.answer[i + 1],
                                                placeholder: _this2.choicePlaceholder() })
                                        ),
                                        i + 1 >= 3 ? Button.component({
                                            type: 'button',
                                            className: 'Button Button--warning Poll-answer-button',
                                            icon: 'minus',
                                            onclick: i + 1 >= 3 ? _this2.removeOption.bind(_this2, i + 1) : ''
                                        }) : '',
                                        m('div', { className: 'clear' })
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
                                m(
                                    'div',
                                    { className: 'Form-group' },
                                    m('div', { className: 'clear' }),
                                    Button.component({
                                        type: 'submit',
                                        className: 'Button Button--primary',
                                        children: 'Submit'
                                    })
                                )
                            )
                        )];
                    }
                }, {
                    key: 'choicePlaceholder',
                    value: function choicePlaceholder() {
                        return 'Option';
                    }
                }, {
                    key: 'addOption',
                    value: function addOption() {
                        if (this.answer.length < 11) {
                            this.answer.push(m.prop(''));
                        } else {
                            alert('You can have a maximum of 10 answers');
                        }
                    }
                }, {
                    key: 'removeOption',
                    value: function removeOption(option) {
                        this.answer[option] = '';
                    }
                }, {
                    key: 'onAdd',
                    value: function onAdd(pollArray) {
                        // Add data to DiscussionComposer post data
                        extend(DiscussionComposer.prototype, 'data', function (data) {
                            data.poll = pollArray;
                        });

                        // Change the text of add poll button to edit poll
                        if (this.question() !== '') {
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
                    }
                }, {
                    key: 'objectSize',
                    value: function objectSize(obj) {
                        var size = 0,
                            key;
                        for (key in obj) {
                            if (obj[key] !== '') size++;
                        }
                        return size;
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

                        if (this.question() === '') {
                            alert('You must include a question');
                            return;
                        }

                        // Add answers to PollArray
                        Object.keys(this.answer).map(function (el, i) {
                            var key = i + 1;
                            pollArray['answers'][key - 1] = _this3.answer[key]();
                        });

                        if (this.objectSize(pollArray.answers) < 2) {
                            alert('You must include a minimum of 2 answers');
                            return;
                        }

                        this.onAdd(pollArray);

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

System.register('reflar/polls/components/PollVote', ['flarum/extend', 'flarum/Component', 'flarum/utils/classList', 'flarum/components/LogInModal'], function (_export, _context) {
    "use strict";

    var extend, override, Component, classList, LogInModal, PollVote;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
            override = _flarumExtend.override;
        }, function (_flarumComponent) {
            Component = _flarumComponent.default;
        }, function (_flarumUtilsClassList) {
            classList = _flarumUtilsClassList.default;
        }, function (_flarumComponentsLogInModal) {
            LogInModal = _flarumComponentsLogInModal.default;
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
                        this.voted = m.prop(false);

                        this.answers = this.poll ? this.poll.answers() : [];

                        if (app.session.user !== undefined) {
                            app.store.find('votes', {
                                poll_id: this.poll.id(),
                                user_id: app.session.user.id()
                            }).then(function (data) {
                                if (data[0] !== undefined) {
                                    _this2.voted(data[0]);
                                }

                                m.redraw();
                            });
                        }
                    }
                }, {
                    key: 'voteView',
                    value: function voteView() {
                        var _this3 = this;

                        if (this.voted() !== false) {
                            return m(
                                'div',
                                null,
                                m(
                                    'h4',
                                    null,
                                    this.poll.question()
                                ),
                                this.answers.map(function (item) {
                                    if (_this3.voted().option_id() === item.data.attributes.id) {
                                        var color = app.forum.data.attributes.themePrimaryColor;
                                    } else {
                                        var color = app.forum.data.attributes.themeSecondaryColor;
                                    }
                                    return m(
                                        'div',
                                        { className: 'PollOption PollVoted' },
                                        m(
                                            'div',
                                            { className: 'PollBar', style: _this3.voted().option_id() === item.data.attributes.id ? 'border-color: ' + color : '' },
                                            m('div', { style: 'width: ' + item.percent() + '%; background:' + color, className: 'PollOption-active' }),
                                            m(
                                                'label',
                                                null,
                                                m(
                                                    'span',
                                                    { style: _this3.calculateColor(color) },
                                                    item.answer()
                                                )
                                            ),
                                            m(
                                                'label',
                                                null,
                                                m(
                                                    'span',
                                                    { style: 'color: #000000', className: 'PollPercent' },
                                                    item.percent(),
                                                    '%'
                                                )
                                            )
                                        )
                                    );
                                }),
                                m('div', { className: 'clear' })
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
                                this.answers.map(function (item) {
                                    return m(
                                        'div',
                                        { className: 'PollOption' },
                                        m(
                                            'div',
                                            { className: 'PollBar' },
                                            m(
                                                'label',
                                                { className: 'checkbox' },
                                                m('input', { type: 'checkbox', onchange: _this3.addVote.bind(_this3, item.id()) }),
                                                m(
                                                    'span',
                                                    null,
                                                    item.answer()
                                                ),
                                                m('span', { className: 'checkmark' })
                                            )
                                        )
                                    );
                                }),
                                m('div', { className: 'clear' })
                            );
                        }
                    }
                }, {
                    key: 'calculateColor',
                    value: function calculateColor(hex) {
                        var _map = [0, 2, 4].map(function (p) {
                            return parseInt(hex.replace('#', '').substr(p, 2), 16);
                        }),
                            _map2 = babelHelpers.slicedToArray(_map, 3),
                            r = _map2[0],
                            g = _map2[1],
                            b = _map2[2];

                        return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? 'color: #000000' : 'color: #ffffff';
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
                        if (app.session.user === undefined) {
                            app.modal.show(new LogInModal());
                            return;
                        } else {
                            app.store.createRecord('votes').save({
                                poll_id: this.poll.id(),
                                user_id: app.session.user.id(),
                                option_id: answer
                            }).then(function () {
                                window.location.reload();
                            });
                        }
                    }
                }]);
                return PollVote;
            }(Component);

            _export('default', PollVote);
        }
    };
});;
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

System.register('reflar/polls/main', ['flarum/app', 'flarum/extend', 'flarum/components/DiscussionComposer', 'flarum/Model', 'reflar/polls/models/Question', 'reflar/polls/models/Answer', 'reflar/polls/models/Vote', 'flarum/models/Discussion', 'flarum/models/Post', 'reflar/polls/PollControl', 'reflar/polls/PollDiscussion', 'reflar/polls/components/PollModal'], function (_export, _context) {
  "use strict";

  var app, extend, override, DiscussionComposer, Model, Question, Answer, Vote, Discussion, Post, PollControl, PollDiscussion, PollModal;
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
    }, function (_reflarPollsModelsQuestion) {
      Question = _reflarPollsModelsQuestion.default;
    }, function (_reflarPollsModelsAnswer) {
      Answer = _reflarPollsModelsAnswer.default;
    }, function (_reflarPollsModelsVote) {
      Vote = _reflarPollsModelsVote.default;
    }, function (_flarumModelsDiscussion) {
      Discussion = _flarumModelsDiscussion.default;
    }, function (_flarumModelsPost) {
      Post = _flarumModelsPost.default;
    }, function (_reflarPollsPollControl) {
      PollControl = _reflarPollsPollControl.default;
    }, function (_reflarPollsPollDiscussion) {
      PollDiscussion = _reflarPollsPollDiscussion.default;
    }, function (_reflarPollsComponentsPollModal) {
      PollModal = _reflarPollsComponentsPollModal.default;
    }],
    execute: function () {

      app.initializers.add('reflar-polls', function (app) {
        // Relationships
        app.store.models.answers = Answer;
        app.store.models.questions = Question;
        app.store.models.votes = Vote;

        Discussion.prototype.Poll = Model.hasOne('Poll');
        Post.prototype.canEditPoll = Model.attribute('canEditPoll');

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
});;
'use strict';

System.register('reflar/polls/PollControl', ['flarum/extend', 'flarum/utils/PostControls', 'flarum/components/Button', 'reflar/polls/components/EditPollModal'], function (_export, _context) {
  "use strict";

  var extend, override, PostControls, Button, EditPollModal;

  _export('default', function () {
    extend(PostControls, 'moderationControls', function (items, post) {
      var discussion = post.discussion();
      var poll = discussion.Poll();

      if (discussion.Poll() && post.canEditPoll() && post.number() === 1) {
        items.add('editPoll', [m(Button, {
          icon: 'check-square',
          className: 'reflar-PollButton',
          onclick: function onclick() {
            app.modal.show(new EditPollModal({ post: post, poll: poll }));
          }
        }, 'Edit Poll')]);

        items.add('removePoll', [m(Button, {
          icon: 'trash',
          className: 'reflar-PollButton',
          onclick: function onclick() {

            if (confirm('Are you sure you want to delete this poll?')) {
              app.request({
                url: app.forum.attribute('apiUrl') + poll.apiEndpoint() + '/' + poll.id(),
                method: 'DELETE'
              });

              location.reload();
            }
          }
        }, 'Remove Poll')]);
      }
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
    }, function (_reflarPollsComponentsEditPollModal) {
      EditPollModal = _reflarPollsComponentsEditPollModal.default;
    }],
    execute: function () {}
  };
});;
'use strict';

System.register('reflar/polls/PollDiscussion', ['flarum/extend', 'flarum/components/CommentPost', 'reflar/polls/components/PollVote'], function (_export, _context) {
  "use strict";

  var extend, override, CommentPost, PollVote;

  _export('default', function () {
    extend(CommentPost.prototype, 'content', function (content) {
      var discussion = this.props.post.discussion();

      if (discussion.Poll() && this.props.post.number() === 1 && !this.props.post.isHidden()) {
        this.subtree.invalidate();

        content.push(PollVote.component({
          poll: discussion.Poll()
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
    }, function (_reflarPollsComponentsPollVote) {
      PollVote = _reflarPollsComponentsPollVote.default;
    }],
    execute: function () {}
  };
});