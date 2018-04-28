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

                        this.pollCreator = this.props.poll.store.data.users[Object.keys(this.props.poll.store.data.users)[0]];

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
                        return app.translator.trans('reflar-polls.forum.modal.edit_title');
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
                                        m('input', { type: 'text', name: 'question', className: 'FormControl', value: this.question(), oninput: m.withAttr('value', this.updateQuestion.bind(this)), placeholder: app.translator.trans('reflar-polls.forum.modal.question_placeholder') })
                                    )
                                ),
                                m(
                                    'h4',
                                    null,
                                    app.translator.trans('reflar-polls.forum.modal.answers')
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
                                                placeholder: app.translator.trans('reflar-polls.forum.modal.answer_placeholder') + ' #' + (i + 1) })
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
                                            placeholder: app.translator.trans('reflar-polls.forum.modal.answer_placeholder') + ' #' + (this.answers.length + 1) })
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
                    key: 'addAnswer',
                    value: function addAnswer(answer) {
                        var _this3 = this;

                        if (this.answers.length < 10) {
                            app.request({
                                method: 'POST',
                                url: app.forum.attribute('apiUrl') + '/answers',
                                data: {
                                    answer: this.newAnswer(),
                                    poll_id: this.props.poll.id(),
                                    user_id: this.pollCreator.id()
                                }
                            }).then(function (response) {
                                _this3.answers.push(response);

                                _this3.newAnswer('');
                                m.redraw();
                            });
                        } else {
                            alert(app.translator.trans('reflar-polls.forum.modal.max'));
                        }
                    }
                }, {
                    key: 'removeOption',
                    value: function removeOption(option) {
                        var _this4 = this;

                        app.request({
                            method: 'DELETE',
                            url: app.forum.attribute('apiUrl') + '/answers/' + option.data.id,
                            data: this.pollCreator.id()
                        });
                        this.answers.some(function (answer, i) {
                            if (answer.data.id === option.data.id) {
                                _this4.answers.splice(i, 1);
                                return true;
                            }
                        });
                    }
                }, {
                    key: 'updateAnswer',
                    value: function updateAnswer(answerToUpdate, value) {
                        app.request({
                            method: 'PATCH',
                            url: app.forum.attribute('apiUrl') + '/answers/' + answerToUpdate.data.id,
                            data: {
                                answer: value,
                                user_id: this.pollCreator.id()
                            }
                        });
                        this.answers.some(function (answer) {
                            if (answer.data.id === answerToUpdate.data.id) {
                                answer.data.attributes.answer = value;
                                return true;
                            }
                        });
                    }
                }, {
                    key: 'onhide',
                    value: function onhide() {
                        location.reload();
                    }
                }, {
                    key: 'updateQuestion',
                    value: function updateQuestion(question) {
                        if (question === '') {
                            alert(app.translator.trans('reflar-polls.forum.modal.include_question'));
                            this.question('');
                            return;
                        }
                        app.request({
                            method: 'PATCH',
                            url: app.forum.attribute('apiUrl') + '/questions/' + this.props.poll.id(),
                            data: {
                                question: question,
                                user_id: this.pollCreator.id()
                            }
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

    var extend, Modal, Button, DiscussionComposer, PollModal;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
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
                        return app.translator.trans('reflar-polls.forum.modal.add_title');
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
                                        m('input', { type: 'text', name: 'question', className: 'FormControl', bidi: this.question, placeholder: app.translator.trans('reflar-polls.forum.modal.question_placeholder') })
                                    )
                                ),
                                m(
                                    'h4',
                                    null,
                                    app.translator.trans('reflar-polls.forum.modal.answers')
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
                                                placeholder: app.translator.trans('reflar-polls.forum.modal.answer_placeholder') + ' #' + (i + 1) })
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
                                        '+ ' + app.translator.trans('reflar-polls.forum.modal.add')
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
                    key: 'addOption',
                    value: function addOption() {
                        if (this.answer.length < 11) {
                            this.answer.push(m.prop(''));
                        } else {
                            alert(app.translator.trans('reflar-polls.forum.modal.max'));
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
                                        app.translator.trans('reflar-polls.forum.composer_discussion.edit')
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
                            alert(app.translator.trans('reflar-polls.forum.modal.include_question'));
                            return;
                        }

                        // Add answers to PollArray
                        Object.keys(this.answer).map(function (el, i) {
                            var key = i + 1;
                            pollArray['answers'][key - 1] = _this3.answer[key]();
                        });

                        if (this.objectSize(pollArray.answers) < 2) {
                            alert(app.translator.trans('reflar-polls.forum.modal.min'));
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

System.register('reflar/polls/components/PollVote', ['flarum/extend', 'flarum/components/Alert', 'flarum/Component', 'flarum/utils/classList', 'flarum/components/LogInModal'], function (_export, _context) {
    "use strict";

    var extend, Alert, Component, classList, LogInModal, PollVote;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsAlert) {
            Alert = _flarumComponentsAlert.default;
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
                        this.user = app.session.user;

                        this.answers = this.poll ? this.poll.answers() : [];

                        if (this.user !== undefined) {
                            app.store.find('votes', {
                                poll_id: this.poll.id(),
                                user_id: this.user.id()
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
                                    var voted = _this3.voted().option_id() === item.data.attributes.id;
                                    var percent = item.percent();
                                    return m(
                                        'div',
                                        { className: 'PollOption PollVoted' },
                                        m(
                                            'div',
                                            {
                                                title: item.votes() >= 1 ? item.votes() + ' ' + app.translator.trans('reflar-polls.forum.tooltip.vote') : item.votes() + ' ' + app.translator.trans('reflar-polls.forum.tooltip.votes'),
                                                className: 'PollBar',
                                                'data-selected': voted,
                                                config: function config(element) {
                                                    $(element).tooltip({ placement: 'right' });
                                                } },
                                            m('div', { style: '--width: ' + percent + '%', className: 'PollOption-active' }),
                                            m(
                                                'label',
                                                null,
                                                m(
                                                    'span',
                                                    null,
                                                    item.answer()
                                                )
                                            ),
                                            m(
                                                'label',
                                                null,
                                                m(
                                                    'span',
                                                    { className: percent !== 100 ? 'PollPercent PollPercent--option' : 'PollPercent' },
                                                    percent,
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
                    value: function addVote(answer, el) {
                        if (!this.user.canVote()) {
                            var alert = new Alert({
                                type: 'error',
                                children: app.translator.trans('core.lib.error.permission_denied_message')
                            });
                            app.alerts.clear();
                            setTimeout(function () {
                                el.srcElement.checked = false;
                                app.alerts.show(alert);
                            }, 195);
                        } else {
                            if (this.user === undefined) {
                                app.modal.show(new LogInModal());
                                return;
                            } else {
                                app.store.createRecord('votes').save({
                                    poll_id: this.poll.id(),
                                    option_id: answer
                                }).then(function () {
                                    location.reload();
                                });
                            }
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

System.register('reflar/polls/main', ['flarum/app', 'flarum/extend', 'flarum/components/DiscussionComposer', 'flarum/Model', 'reflar/polls/models/Question', 'reflar/polls/models/Answer', 'reflar/polls/models/Vote', 'flarum/models/Discussion', 'flarum/models/User', 'reflar/polls/PollControl', 'reflar/polls/PollDiscussion', 'reflar/polls/components/PollModal'], function (_export, _context) {
    "use strict";

    var app, extend, override, DiscussionComposer, Model, Question, Answer, Vote, Discussion, User, PollControl, PollDiscussion, PollModal;
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
        }, function (_flarumModelsUser) {
            User = _flarumModelsUser.default;
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

                User.prototype.canEditPolls = Model.attribute('canEditPolls');
                User.prototype.canStartPolls = Model.attribute('canStartPolls');
                User.prototype.canSelfEditPolls = Model.attribute('canSelfEditPolls');
                User.prototype.canVote = Model.attribute('canVote');

                var pollModal = new PollModal();

                DiscussionComposer.prototype.addPoll = function () {
                    app.modal.show(pollModal);
                };

                // Add button to DiscussionComposer header
                extend(DiscussionComposer.prototype, 'headerItems', function (items) {
                    if (app.session.user.canStartPolls()) {
                        items.add('polls', m(
                            'a',
                            { className: 'DiscussionComposer-poll', onclick: this.addPoll },
                            m(
                                'span',
                                { className: 'TagLabel' },
                                app.translator.trans('reflar-polls.forum.composer_discussion.add_poll')
                            )
                        ), 1);
                    }
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

    var extend, PostControls, Button, EditPollModal;

    _export('default', function () {
        extend(PostControls, 'moderationControls', function (items, post) {
            var discussion = post.discussion();
            var poll = discussion.Poll();
            var user = app.session.user;

            if (discussion.Poll() && (user.canEditPolls() || post.user().canSelfEditPolls() && post.user().id() === user.id()) && post.number() === 1) {
                items.add('editPoll', [m(Button, {
                    icon: 'check-square',
                    className: 'reflar-PollButton',
                    onclick: function onclick() {
                        app.modal.show(new EditPollModal({ post: post, poll: poll }));
                    }
                }, app.translator.trans('reflar-polls.forum.moderation.edit'))]);

                items.add('removePoll', [m(Button, {
                    icon: 'trash',
                    className: 'reflar-PollButton',
                    onclick: function onclick() {

                        if (confirm(app.translator.trans('reflar-polls.forum.moderation.delete_confirm'))) {
                            app.request({
                                url: app.forum.attribute('apiUrl') + '/questions/' + poll.id(),
                                method: 'DELETE',
                                data: poll.store.data.users[Object.keys(poll.store.data.users)[0]].id()
                            }).then(function () {
                                location.reload();
                            });
                        }
                    }
                }, app.translator.trans('reflar-polls.forum.moderation.delete'))]);
            }
        });
    });

    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
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