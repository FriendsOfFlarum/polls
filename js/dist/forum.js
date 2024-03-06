/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/forum/addComposerItems.tsx":
/*!****************************************!*\
  !*** ./src/forum/addComposerItems.tsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addToComposer: () => (/* binding */ addToComposer),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_components_DiscussionComposer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/components/DiscussionComposer */ "flarum/forum/components/DiscussionComposer");
/* harmony import */ var flarum_forum_components_DiscussionComposer__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_DiscussionComposer__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_forum_components_ReplyComposer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/forum/components/ReplyComposer */ "flarum/forum/components/ReplyComposer");
/* harmony import */ var flarum_forum_components_ReplyComposer__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_ReplyComposer__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _components_CreatePollModal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/CreatePollModal */ "./src/forum/components/CreatePollModal.tsx");






function toPoll(data) {
  if (data) {
    var poll = flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().store.createRecord('polls');
    poll.tempOptions = data.options.map(function (option) {
      var pollOption = flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().store.createRecord('poll_options');
      pollOption.pushAttributes(option);
      return pollOption;
    });
    poll.pushAttributes(data);
    return poll;
  }
  return data;
}
var addToComposer = function addToComposer(composer) {
  // @ts-ignore
  composer.prototype.addPoll = function () {
    var _this = this;
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().modal.show(_components_CreatePollModal__WEBPACK_IMPORTED_MODULE_5__["default"], {
      poll: toPoll(this.composer.fields.poll),
      onsubmit: function onsubmit(poll) {
        return _this.composer.fields.poll = poll;
      }
    });
  };

  // Add button to DiscussionComposer header
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)(composer.prototype, 'headerItems', function (items) {
    var _this$composer$body, _discussion$canStartP;
    var discussion = (_this$composer$body = this.composer.body) == null || (_this$composer$body = _this$composer$body.attrs) == null ? void 0 : _this$composer$body.discussion;

    // @ts-ignore
    var canStartPoll = (_discussion$canStartP = discussion == null ? void 0 : discussion.canStartPoll()) != null ? _discussion$canStartP : flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.canStartPolls();
    if (canStartPoll) {
      items.add('polls', m("a", {
        className: "ComposerBody-poll",
        onclick: this.addPoll.bind(this)
      }, m("span", {
        className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_2___default()('PollLabel', !this.composer.fields.poll && 'none')
      }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans("fof-polls.forum.composer_discussion." + (this.composer.fields.poll ? 'edit' : 'add') + "_poll"))), 1);
    }
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)(composer.prototype, 'data', function (data) {
    if (this.composer.fields.poll) {
      data.poll = this.composer.fields.poll;
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function () {
  addToComposer((flarum_forum_components_DiscussionComposer__WEBPACK_IMPORTED_MODULE_3___default()));
  addToComposer((flarum_forum_components_ReplyComposer__WEBPACK_IMPORTED_MODULE_4___default()));
});

/***/ }),

/***/ "./src/forum/addDiscussionBadge.tsx":
/*!******************************************!*\
  !*** ./src/forum/addDiscussionBadge.tsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Badge__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Badge */ "flarum/common/components/Badge");
/* harmony import */ var flarum_common_components_Badge__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Badge__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_components_DiscussionList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/components/DiscussionList */ "flarum/forum/components/DiscussionList");
/* harmony import */ var flarum_forum_components_DiscussionList__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_DiscussionList__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/models/Discussion */ "flarum/common/models/Discussion");
/* harmony import */ var flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_4__);





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function () {
  // @ts-ignore
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_DiscussionList__WEBPACK_IMPORTED_MODULE_3___default().prototype), 'requestParams', function (params) {
    params.include.push('poll');
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_4___default().prototype), 'badges', function (badges) {
    // @ts-ignore
    if (this.hasPoll()) {
      badges.add('poll', flarum_common_components_Badge__WEBPACK_IMPORTED_MODULE_2___default().component({
        type: 'poll',
        label: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-polls.forum.tooltip.badge'),
        icon: 'fas fa-poll'
      }), 5);
    }
  });
});

/***/ }),

/***/ "./src/forum/addNavItem.ts":
/*!*********************************!*\
  !*** ./src/forum/addNavItem.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addNavItem)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/IndexPage */ "flarum/forum/components/IndexPage");
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/LinkButton */ "flarum/common/components/LinkButton");
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3__);




function addNavItem() {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'navItems', function (items) {
    items.add('fof-polls-showcase', flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default().component({
      href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().route('fof.polls.showcase'),
      icon: 'fas fa-poll'
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-polls.forum.page.nav')), 35);
    var showAllGlobalPolls = flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('canStartGlobalPolls');
    if (showAllGlobalPolls) {
      items.add('fof-polls-list', flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default().component({
        href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().route('fof.polls.list'),
        icon: 'fas fa-list'
      }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('fof-polls.forum.page.nav-all')), 32);
    }
  });
}

/***/ }),

/***/ "./src/forum/addPollsToPost.tsx":
/*!**************************************!*\
  !*** ./src/forum/addPollsToPost.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_CommentPost__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/CommentPost */ "flarum/forum/components/CommentPost");
/* harmony import */ var flarum_forum_components_CommentPost__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_CommentPost__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_PollView__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/PollView */ "./src/forum/components/PollView.tsx");
/* harmony import */ var flarum_forum_components_DiscussionPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/forum/components/DiscussionPage */ "flarum/forum/components/DiscussionPage");
/* harmony import */ var flarum_forum_components_DiscussionPage__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_DiscussionPage__WEBPACK_IMPORTED_MODULE_4__);
function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function () {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_CommentPost__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'content', function (content) {
    var post = this.attrs.post;
    if ((!post.isHidden() || this.revealContent) && post.polls()) {
      for (var _iterator = _createForOfIteratorHelperLoose(post.polls()), _step; !(_step = _iterator()).done;) {
        var poll = _step.value;
        if (poll) {
          content.push(m(_components_PollView__WEBPACK_IMPORTED_MODULE_3__["default"], {
            poll: poll
          }));
        }
      }
    }
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_CommentPost__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'oninit', function () {
    var _this = this;
    this.subtree.check(function () {
      var polls = _this.attrs.post.polls();
      var checks = polls == null || polls.map == null ? void 0 : polls.map(function (poll) {
        var _poll$data, _poll$options$map, _poll$options, _poll$myVotes$map, _poll$myVotes;
        return poll && [(_poll$data = poll.data) == null ? void 0 : _poll$data.attributes, (_poll$options$map = (_poll$options = poll.options()).map) == null ? void 0 : _poll$options$map.call(_poll$options, function (option) {
          var _option$data;
          return option == null || (_option$data = option.data) == null ? void 0 : _option$data.attributes;
        }), (_poll$myVotes$map = (_poll$myVotes = poll.myVotes()).map) == null ? void 0 : _poll$myVotes$map.call(_poll$myVotes, function (vote) {
          var _vote$option;
          return (_vote$option = vote.option()) == null ? void 0 : _vote$option.id();
        })];
      });
      return JSON.stringify(checks);
    });
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_DiscussionPage__WEBPACK_IMPORTED_MODULE_4___default().prototype), 'oncreate', function () {
    // @ts-ignore
    if ((flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().pusher)) {
      // @ts-ignore
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().pusher.then(function (binding) {
        // We will listen for updates to all polls and options
        // Even if that model is not in the current discussion, it doesn't really matter
        binding.channels.main.bind('updatedPollOptions', function (data) {
          var poll = flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().store.getById('polls', data['pollId']);
          if (poll) {
            poll.pushAttributes({
              voteCount: data['pollVoteCount']
            });

            // Not redrawing here, as the option below should trigger the redraw already
          }
          var changedOptions = data['options'];
          for (var optionId in changedOptions) {
            var option = flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().store.getById('poll_options', optionId);
            if (option && option.voteCount() !== undefined) {
              option.pushAttributes({
                voteCount: changedOptions[optionId]
              });
            }
          }
          m.redraw();
        });
      });
    }
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_DiscussionPage__WEBPACK_IMPORTED_MODULE_4___default().prototype), 'onremove', function () {
    // @ts-ignore
    if ((flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().pusher)) {
      // @ts-ignore
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().pusher.then(function (binding) {
        binding.channels.main.unbind('updatedPollOptions');
      });
    }
  });
});

/***/ }),

/***/ "./src/forum/addPostControls.tsx":
/*!***************************************!*\
  !*** ./src/forum/addPostControls.tsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_utils_PostControls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/utils/PostControls */ "flarum/forum/utils/PostControls");
/* harmony import */ var flarum_forum_utils_PostControls__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_utils_PostControls__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_CreatePollModal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/CreatePollModal */ "./src/forum/components/CreatePollModal.tsx");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5__);






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (function () {
  var createPoll = function createPoll(post) {
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().modal.show(_components_CreatePollModal__WEBPACK_IMPORTED_MODULE_4__["default"], {
      onsubmit: function onsubmit(data) {
        return flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().store.createRecord('polls').save((0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, data, {
          relationships: {
            post: post
          }
        }), {
          data: {
            include: 'options,myVotes,myVotes.option'
          }
        }).then(function (poll) {
          var _post$rawRelationship;
          // @ts-ignore
          (_post$rawRelationship = post.rawRelationship('polls')) == null || _post$rawRelationship.push == null || _post$rawRelationship.push({
            type: 'polls',
            id: poll.id()
          });
          return poll;
        });
      }
    });
  };
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_2__.extend)((flarum_forum_utils_PostControls__WEBPACK_IMPORTED_MODULE_3___default()), 'moderationControls', function (items, post) {
    // @ts-ignore
    if (!post.isHidden() && post.canStartPoll()) {
      items.add('addPoll', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default()), {
        icon: "fas fa-poll",
        onclick: createPoll.bind(this, post)
      }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.moderation.add')));
    }
  });
});

/***/ }),

/***/ "./src/forum/components/AbstractPollPage.tsx":
/*!***************************************************!*\
  !*** ./src/forum/components/AbstractPollPage.tsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AbstractPollPage: () => (/* binding */ AbstractPollPage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Page */ "flarum/common/components/Page");
/* harmony import */ var flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/forum/components/IndexPage */ "flarum/forum/components/IndexPage");
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/helpers/listItems */ "flarum/common/helpers/listItems");
/* harmony import */ var flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_components_SelectDropdown__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/components/SelectDropdown */ "flarum/common/components/SelectDropdown");
/* harmony import */ var flarum_common_components_SelectDropdown__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_SelectDropdown__WEBPACK_IMPORTED_MODULE_7__);








var AbstractPollPage = /*#__PURE__*/function (_Page) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(AbstractPollPage, _Page);
  function AbstractPollPage() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Page.call.apply(_Page, [this].concat(args)) || this;
    _this.loading = false;
    _this.poll = null;
    _this.polls = [];
    return _this;
  }
  var _proto = AbstractPollPage.prototype;
  _proto.view = function view() {
    return m("div", {
      className: "PollsPage"
    }, this.pageContent().toArray());
  };
  _proto.pageContent = function pageContent() {
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_2___default())();
    items.add('hero', this.hero(), 100);
    items.add('main', m("div", {
      className: "container"
    }, this.mainContent().toArray()), 10);
    return items;
  };
  _proto.mainContent = function mainContent() {
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_2___default())();
    items.add('sidebar', this.sidebar(), 100);
    items.add('content', this.content(), 10);
    return items;
  };
  _proto.content = function content() {
    return m("div", {
      className: "PollsPage-content sideNavOffset"
    }, this.contentItems().toArray());
  };
  _proto.contentItems = function contentItems() {
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_2___default())();
    if (this.loading) {
      items.add('loading', m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default()), null));
    }
    return items;
  };
  _proto.hero = function hero() {
    return flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4___default().prototype.hero();
  };
  _proto.sidebar = function sidebar() {
    return m("nav", {
      className: "PollsPage-nav IndexPage-nav sideNav"
    }, m("ul", null, flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_5___default()(this.sidebarItems().toArray())));
  };
  _proto.sidebarItems = function sidebarItems() {
    var items = flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4___default().prototype.sidebarItems();
    items.setContent('nav', m((flarum_common_components_SelectDropdown__WEBPACK_IMPORTED_MODULE_7___default()), {
      buttonClassName: "Button",
      className: "App-titleControl",
      accessibleToggleLabel: flarum_forum_app__WEBPACK_IMPORTED_MODULE_6___default().translator.trans('core.forum.index.toggle_sidenav_dropdown_accessible_label')
    }, this.navItems().toArray()));
    return items;
  };
  _proto.navItems = function navItems() {
    var items = flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4___default().prototype.navItems();
    if (flarum_forum_app__WEBPACK_IMPORTED_MODULE_6___default().initializers.has('flarum-tags')) {
      // remove the tags from the nav items
      items.remove('separator');
      items.remove('moreTags');

      // each tag is added using the key "tag{id}". We need to remove all of them
      for (var key in items.toObject()) {
        if (key.startsWith('tag') && key !== 'tags') {
          items.remove(key);
        }
      }
    }
    return items;
  };
  return AbstractPollPage;
}((flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_1___default()));

/***/ }),

/***/ "./src/forum/components/ComposePollHero.tsx":
/*!**************************************************!*\
  !*** ./src/forum/components/ComposePollHero.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ComposePollHero)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/LinkButton */ "flarum/common/components/LinkButton");
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4__);





var ComposePollHero = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(ComposePollHero, _Component);
  function ComposePollHero() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.poll = void 0;
    return _this;
  }
  var _proto = ComposePollHero.prototype;
  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode);
    this.poll = this.attrs.poll;
  };
  _proto.view = function view() {
    return m("div", {
      className: "ComposePollHero Hero"
    }, m("div", {
      className: "container"
    }, m("div", {
      className: "containerNarrow"
    }, m("h2", {
      className: "Hero-title"
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("fof-polls.forum.compose." + (!!this.poll.id() ? 'edit' : 'add') + "_title")), m("div", {
      className: "ComposePollHero-controls"
    }, this.controlItems().toArray()))));
  };
  _proto.controlItems = function controlItems() {
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_4___default())();
    items.add('edit', m((flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default()), {
      icon: "far fa-edit",
      className: "Button Button--secondary GlobalPollListLink",
      itemClassName: "App-primaryControl",
      href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().route('fof.polls.list')
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.compose.polls_manager')));
    if (this.poll.exists) {
      items.add('view', m((flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default()), {
        icon: "far fa-arrow-up-right-from-square",
        className: "Button Button--secondary PollPreviewLink",
        itemClassName: "App-primaryControl",
        href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().route('fof.polls.view', {
          id: this.poll.id()
        })
      }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.compose.polls_preview')));
    }
    return items;
  };
  return ComposePollHero;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default()));


/***/ }),

/***/ "./src/forum/components/ComposePollPage.tsx":
/*!**************************************************!*\
  !*** ./src/forum/components/ComposePollPage.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ComposePollPage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Page */ "flarum/common/components/Page");
/* harmony import */ var flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _PollForm__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./PollForm */ "./src/forum/components/PollForm.tsx");
/* harmony import */ var _states_PollFormState__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../states/PollFormState */ "./src/forum/states/PollFormState.ts");
/* harmony import */ var _ComposePollHero__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ComposePollHero */ "./src/forum/components/ComposePollHero.tsx");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! flarum/common/helpers/listItems */ "flarum/common/helpers/listItems");
/* harmony import */ var flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var flarum_common_components_SelectDropdown__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! flarum/common/components/SelectDropdown */ "flarum/common/components/SelectDropdown");
/* harmony import */ var flarum_common_components_SelectDropdown__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_SelectDropdown__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! flarum/forum/components/IndexPage */ "flarum/forum/components/IndexPage");
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_13__);














var ComposePollPage = /*#__PURE__*/function (_Page) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(ComposePollPage, _Page);
  function ComposePollPage() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Page.call.apply(_Page, [this].concat(args)) || this;
    _this.poll = null;
    _this.loading = false;
    return _this;
  }
  var _proto = ComposePollPage.prototype;
  _proto.oninit = function oninit(vnode) {
    var _this2 = this,
      _this$poll,
      _this$poll2;
    _Page.prototype.oninit.call(this, vnode);

    // Get the `edit` parameter from the URL
    var editId = m.route.param('id');
    if (editId) {
      this.poll = flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().store.getById('poll', editId);
      if (!this.poll) {
        this.loading = true;
        flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().store.find('fof/polls', editId).then(function (item) {
          var _this2$poll;
          _this2.poll = item;
          _this2.loading = false;
          flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().setTitle(flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans("fof-polls.forum.compose." + (!!((_this2$poll = _this2.poll) != null && _this2$poll.id()) ? 'edit' : 'add') + "_title"));
          m.redraw();
        });
      }
    } else {
      this.poll = _states_PollFormState__WEBPACK_IMPORTED_MODULE_7__["default"].createNewPoll();
    }
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().history.push('compose-poll', flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans("fof-polls.forum.compose." + (!!((_this$poll = this.poll) != null && _this$poll.id()) ? 'edit' : 'add') + "_title"));
    this.bodyClass = 'App--compose-poll';
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().setTitle(flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans("fof-polls.forum.compose." + (!!((_this$poll2 = this.poll) != null && _this$poll2.id()) ? 'edit' : 'add') + "_title"));
  };
  _proto.view = function view() {
    // prevent users from accessing the page if they can't start global polls
    if (!flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().forum.attribute('canStartGlobalPolls')) {
      m.route.set('/');
      return;
    }
    if (this.loading) {
      return m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5___default()), null);
    }
    return m("div", {
      className: "ComposePollPage"
    }, m(_ComposePollHero__WEBPACK_IMPORTED_MODULE_8__["default"], {
      poll: this.poll
    }), m("div", {
      className: "container"
    }, m("div", {
      className: "sideNavContainer"
    }, m("nav", {
      className: "PollsPage-nav sideNav"
    }, m("ul", null, flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_10___default()(this.sidebarItems().toArray()))), m("div", {
      className: "sideNavOffset"
    }, m(_PollForm__WEBPACK_IMPORTED_MODULE_6__["default"], {
      poll: this.poll,
      onsubmit: this.onsubmit.bind(this)
    })))));
  };
  _proto.onsubmit = /*#__PURE__*/function () {
    var _onsubmit = (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee(data, state) {
      var isNew, alertAttrs, alertId;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            isNew = state.poll.id() === undefined;
            _context.next = 3;
            return state.save(data);
          case 3:
            alertAttrs = isNew ? {
              type: 'success',
              controls: [m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_9___default()), {
                className: "Button Button--link",
                onclick: function onclick() {
                  return m.route.set(flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().route('fof.polls.compose', {
                    id: state.poll.id()
                  }));
                }
              }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans('fof-polls.forum.compose.continue_editing'))]
            } : {
              type: 'success'
            }; // Show success alert
            alertId = flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().alerts.show(alertAttrs, flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans('fof-polls.forum.compose.success')); // Hide alert after 10 seconds
            setTimeout(function () {
              return flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().alerts.dismiss(alertId);
            }, 10000);
            if (isNew) {
              m.route.set(flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().route('fof.polls.list'));
            }
          case 7:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function onsubmit(_x, _x2) {
      return _onsubmit.apply(this, arguments);
    }
    return onsubmit;
  }();
  _proto.sidebarItems = function sidebarItems() {
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_11___default())();
    items.add('nav', m((flarum_common_components_SelectDropdown__WEBPACK_IMPORTED_MODULE_12___default()), {
      buttonClassName: "Button",
      className: "App-titleControl",
      accessibleToggleLabel: flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans('core.forum.index.toggle_sidenav_dropdown_accessible_label')
    }, this.navItems().toArray()));
    return items;
  };
  _proto.navItems = function navItems() {
    return flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_13___default().prototype.navItems();
  };
  return ComposePollPage;
}((flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_4___default()));


/***/ }),

/***/ "./src/forum/components/CreatePollModal.tsx":
/*!**************************************************!*\
  !*** ./src/forum/components/CreatePollModal.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreatePollModal)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Modal */ "flarum/common/components/Modal");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _PollForm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./PollForm */ "./src/forum/components/PollForm.tsx");






var CreatePollModal = /*#__PURE__*/function (_Modal) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(CreatePollModal, _Modal);
  function CreatePollModal() {
    return _Modal.apply(this, arguments) || this;
  }
  var _proto = CreatePollModal.prototype;
  _proto.title = function title() {
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans('fof-polls.forum.modal.add_title');
  };
  _proto.className = function className() {
    return 'PollDiscussionModal Modal--medium';
  };
  _proto.content = function content() {
    return [m("div", {
      className: "Modal-body"
    }, m(_PollForm__WEBPACK_IMPORTED_MODULE_5__["default"], {
      poll: this.attrs.poll,
      onsubmit: this.onFormSubmit.bind(this)
    }))];
  };
  _proto.onFormSubmit = /*#__PURE__*/function () {
    var _onFormSubmit = (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee(data, state) {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            this.hide();
            _context.next = 3;
            return this.attrs.onsubmit(data);
          case 3:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function onFormSubmit(_x, _x2) {
      return _onFormSubmit.apply(this, arguments);
    }
    return onFormSubmit;
  }();
  return CreatePollModal;
}((flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_4___default()));


/***/ }),

/***/ "./src/forum/components/EditPollModal.tsx":
/*!************************************************!*\
  !*** ./src/forum/components/EditPollModal.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EditPollModal)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _CreatePollModal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CreatePollModal */ "./src/forum/components/CreatePollModal.tsx");





var EditPollModal = /*#__PURE__*/function (_CreatePollModal) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(EditPollModal, _CreatePollModal);
  function EditPollModal() {
    return _CreatePollModal.apply(this, arguments) || this;
  }
  var _proto = EditPollModal.prototype;
  _proto.title = function title() {
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans('fof-polls.forum.modal.edit_title');
  };
  _proto.onFormSubmit = /*#__PURE__*/function () {
    var _onFormSubmit = (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee(data, state) {
      var alertId;
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return state.save(data);
          case 2:
            // Show success alert
            alertId = flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().alerts.show({
              type: 'success'
            }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().translator.trans('fof-polls.forum.compose.success')); // Hide alert after 10 seconds
            setTimeout(function () {
              return flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().alerts.dismiss(alertId);
            }, 10000);
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    function onFormSubmit(_x, _x2) {
      return _onFormSubmit.apply(this, arguments);
    }
    return onFormSubmit;
  }();
  return EditPollModal;
}(_CreatePollModal__WEBPACK_IMPORTED_MODULE_4__["default"]);


/***/ }),

/***/ "./src/forum/components/ListVotersModal.tsx":
/*!**************************************************!*\
  !*** ./src/forum/components/ListVotersModal.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ListVotersModal)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Modal */ "flarum/common/components/Modal");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/helpers/avatar */ "flarum/common/helpers/avatar");
/* harmony import */ var flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/helpers/username */ "flarum/common/helpers/username");
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_6__);







var ListVotersModal = /*#__PURE__*/function (_Modal) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(ListVotersModal, _Modal);
  function ListVotersModal() {
    return _Modal.apply(this, arguments) || this;
  }
  var _proto = ListVotersModal.prototype;
  _proto.oninit = function oninit(vnode) {
    var _this = this;
    _Modal.prototype.oninit.call(this, vnode);
    this.loading = true;
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().store.find('fof/polls', this.attrs.poll.id(), {
      include: 'votes,votes.user,votes.option'
    }).then(function () {
      return _this.loading = false;
    })["finally"](function () {
      return m.redraw();
    });
  };
  _proto.className = function className() {
    return 'Modal--medium VotesModal';
  };
  _proto.title = function title() {
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.votes_modal.title');
  };
  _proto.content = function content() {
    var options = this.attrs.poll.options();
    return m("div", {
      className: "Modal-body"
    }, this.loading ? m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_6___default()), null) : options.map(this.optionContent.bind(this)));
  };
  _proto.optionContent = function optionContent(opt) {
    var votes = (this.attrs.poll.votes() || []).filter(function (v) {
      return opt.id() === v.option().id();
    });
    return m("div", {
      className: "VotesModal-option"
    }, m("h2", null, opt.answer() + ':'), votes.length ? m("div", {
      className: "VotesModal-list"
    }, votes.map(this.voteContent.bind(this))) : m("h4", null, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.modal.no_voters')));
  };
  _proto.voteContent = function voteContent(vote) {
    var user = vote.user();
    var attrs = user && {
      href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().route.user(user)
    };
    return m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_5___default()), attrs, flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_3___default()(user), " ", flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_4___default()(user));
  };
  return ListVotersModal;
}((flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_2___default()));


/***/ }),

/***/ "./src/forum/components/PollForm.tsx":
/*!*******************************************!*\
  !*** ./src/forum/components/PollForm.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PollForm)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/components/Switch */ "flarum/common/components/Switch");
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/utils/Stream */ "flarum/common/utils/Stream");
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/common/utils/extractText */ "flarum/common/utils/extractText");
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _form_FormError__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./form/FormError */ "./src/forum/components/form/FormError.tsx");
/* harmony import */ var _states_PollFormState__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../states/PollFormState */ "./src/forum/states/PollFormState.ts");
/* harmony import */ var _utils_PollControls__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../utils/PollControls */ "./src/forum/utils/PollControls.tsx");
/* harmony import */ var _UploadPollImageButton__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./UploadPollImageButton */ "./src/forum/components/UploadPollImageButton.tsx");














var PollForm = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(PollForm, _Component);
  function PollForm() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.options = [];
    _this.optionAnswers = [];
    _this.optionImageUrls = [];
    _this.question = void 0;
    _this.subtitle = void 0;
    _this.endDate = void 0;
    _this.publicPoll = void 0;
    _this.allowMultipleVotes = void 0;
    _this.hideVotes = void 0;
    _this.allowChangeVote = void 0;
    _this.maxVotes = void 0;
    _this.datepickerMinDate = '';
    _this.pollImage = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_8___default()(null);
    return _this;
  }
  var _proto = PollForm.prototype;
  // Stream to store uploaded image data
  _proto.oninit = function oninit(vnode) {
    var _poll$tempOptions;
    _Component.prototype.oninit.call(this, vnode);
    this.state = new _states_PollFormState__WEBPACK_IMPORTED_MODULE_11__["default"](this.attrs.poll);

    // state handles poll initialization
    var poll = this.state.poll;
    this.options = (_poll$tempOptions = poll.tempOptions) != null ? _poll$tempOptions : poll.options();
    this.optionAnswers = this.options.map(function (o) {
      return flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_8___default()(o.answer());
    });
    this.optionImageUrls = this.options.map(function (o) {
      return flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_8___default()(o.imageUrl());
    });
    this.question = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_8___default()(poll.question());
    this.subtitle = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_8___default()(poll.subtitle());
    this.endDate = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_8___default()(this.formatDate(poll.endDate()));
    this.publicPoll = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_8___default()(poll.publicPoll());
    this.allowMultipleVotes = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_8___default()(poll.allowMultipleVotes());
    this.hideVotes = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_8___default()(poll.hideVotes());
    this.allowChangeVote = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_8___default()(poll.allowChangeVote());
    this.maxVotes = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_8___default()(poll.maxVotes() || 0);

    // Set minimum date for datepicker to current date
    this.datepickerMinDate = this.formatDate();

    // Replace minimum of 'today' for poll end date only if the poll is not already closed
    if (this.endDate() && dayjs(poll.endDate).isAfter(dayjs())) {
      // We know that endDate is set, so we can safely cast the result to string
      this.datepickerMinDate = this.formatDate(poll.endDate());
    }
  };
  _proto.view = function view() {
    return m("form", {
      onsubmit: this.onsubmit.bind(this)
    }, m("div", {
      className: "PollDiscussionModal-form"
    }, this.fields().toArray()));
  };
  _proto.fields = function fields() {
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_7___default())();
    items.add('question', m("div", {
      className: "Form-group"
    }, m("label", {
      className: "label"
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.question_placeholder')), m("input", {
      type: "text",
      name: "question",
      className: "FormControl",
      bidi: this.question
    })), 100);
    items.add('subtitle', m("div", {
      className: "Form-group"
    }, m("label", {
      className: "label"
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.subtitle_placeholder')), m("input", {
      type: "text",
      name: "subtitle",
      className: "FormControl",
      bidi: this.subtitle
    })), 95);
    items.add('poll-image', m("div", {
      className: "Form-group"
    }, m("label", {
      className: "label"
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.poll_image.label')), m("p", {
      className: "helpText"
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.poll_image.help')), m(_UploadPollImageButton__WEBPACK_IMPORTED_MODULE_13__["default"], {
      name: "pollImage",
      stream: this.pollImage
    })), 90);
    items.add('answers', m("div", {
      className: "PollModal--answers Form-group"
    }, m("label", {
      className: "label PollModal--answers-title"
    }, m("span", null, flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.options_label')), flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default().component({
      className: 'Button PollModal--button Button--icon small',
      icon: 'fas fa-plus',
      onclick: this.addOption.bind(this)
    })), this.displayOptions()), 80);
    items.add('date', m("div", {
      className: "Form-group"
    }, m("label", {
      className: "label"
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.date_placeholder')), m("div", {
      className: "PollModal--date"
    }, m("input", {
      className: "FormControl",
      type: "datetime-local",
      name: "date",
      bidi: this.endDate,
      min: this.datepickerMinDate,
      max: this.formatDate('2038')
    }), flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default().component({
      className: 'Button PollModal--button Button--icon',
      icon: 'fas fa-times',
      onclick: this.endDate.bind(this, null)
    })), this.endDate() && m("p", {
      className: "helpText"
    }, m("i", {
      "class": "icon fas fa-clock"
    }), "\xA0", dayjs(this.endDate()).isBefore(dayjs()) ? flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.poll_ended') : flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.days_remaining', {
      time: dayjs(this.endDate()).fromNow()
    }))), 40);
    items.add('public', m("div", {
      className: "Form-group"
    }, flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default().component({
      state: this.publicPoll() || false,
      onchange: this.publicPoll
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.public_poll_label'))), 20);
    items.add('hide-votes', m("div", {
      className: "Form-group"
    }, m((flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default()), {
      state: this.endDate() && this.hideVotes(),
      onchange: this.hideVotes,
      disabled: !this.endDate()
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.hide_votes_label'))), 20);
    items.add('allow-change-vote', m("div", {
      className: "Form-group"
    }, m((flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default()), {
      state: this.allowChangeVote(),
      onchange: this.allowChangeVote
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.allow_change_vote_label'))), 20);
    items.add('allow-multiple-votes', m("div", {
      className: "Form-group"
    }, flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_6___default().component({
      state: this.allowMultipleVotes() || false,
      onchange: this.allowMultipleVotes
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.allow_multiple_votes_label'))), 15);
    if (this.allowMultipleVotes()) {
      items.add('max-votes', m("div", {
        className: "Form-group"
      }, m("label", {
        className: "label"
      }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.max_votes_label')), m("input", {
        type: "number",
        min: "0",
        max: this.options.length,
        name: "maxVotes",
        className: "FormControl",
        bidi: this.maxVotes
      }), m("p", {
        className: "helpText"
      }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.max_votes_help'))), 15);
    }
    items.add('submit', m("div", {
      className: "Form-group"
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default()), {
      type: "submit",
      className: "Button Button--primary PollModal-SubmitButton",
      icon: "fas fa-save",
      loading: this.state.loading
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.submit')), this.state.poll.exists && m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default()), {
      className: "Button Button--secondary PollModal-deleteButton",
      icon: "fas fa-trash-alt",
      loading: this.state.deleting,
      onclick: this["delete"].bind(this)
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.delete'))), -10);
    return items;
  };
  _proto.displayOptions = function displayOptions() {
    var _this2 = this;
    return Object.keys(this.options).map(function (option, i) {
      return m("div", {
        className: "Form-group"
      }, m("fieldset", {
        className: "Poll-answer-input"
      }, m("input", {
        className: "FormControl",
        type: "text",
        name: 'answer' + (i + 1),
        bidi: _this2.optionAnswers[i],
        placeholder: flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.option_placeholder') + ' #' + (i + 1)
      }), flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().forum.attribute('allowPollOptionImage') ? m("input", {
        className: "FormControl",
        type: "text",
        name: 'answerImage' + (i + 1),
        bidi: _this2.optionImageUrls[i],
        placeholder: flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.image_option_placeholder') + ' #' + (i + 1)
      }) : null), i >= 2 ? flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default().component({
        type: 'button',
        className: 'Button PollModal--button Button--icon',
        icon: 'fas fa-minus',
        onclick: i >= 2 ? _this2.removeOption.bind(_this2, i) : ''
      }) : '');
    });
  };
  _proto.addOption = function addOption() {
    var max = Math.max(flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().forum.attribute('pollMaxOptions'), 2);
    if (this.options.length < max) {
      this.options.push(flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().store.createRecord('poll_options'));
      this.optionAnswers.push(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_8___default()(''));
      this.optionImageUrls.push(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_8___default()(''));
    } else {
      alert(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_9___default()(flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.max', {
        max: max
      })));
    }
  };
  _proto.removeOption = function removeOption(i) {
    this.options.splice(i, 1);
    this.optionAnswers.splice(i, 1);
    this.optionImageUrls.splice(i, 1);
  };
  _proto.data = function data() {
    var _this3 = this,
      _this$dateToTimestamp;
    if (this.question() === '') {
      throw new _form_FormError__WEBPACK_IMPORTED_MODULE_10__["default"](flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.include_question'));
    }
    if (this.options.length < 2) {
      throw new _form_FormError__WEBPACK_IMPORTED_MODULE_10__["default"](flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.min'));
    }
    var pollExists = this.state.poll.exists;
    var options = this.options.map(function (option, i) {
      option.pushAttributes({
        answer: _this3.optionAnswers[i](),
        imageUrl: _this3.optionImageUrls[i]()
      });
      return pollExists ? option.data : option.data.attributes;
    });
    return {
      question: this.question(),
      subtitle: this.subtitle(),
      pollImage: this.pollImage(),
      endDate: (_this$dateToTimestamp = this.dateToTimestamp(this.endDate())) != null ? _this$dateToTimestamp : false,
      publicPoll: this.publicPoll(),
      hideVotes: this.hideVotes(),
      allowChangeVote: this.allowChangeVote(),
      allowMultipleVotes: this.allowMultipleVotes(),
      maxVotes: this.maxVotes(),
      options: options
    };
  };
  _proto.onsubmit = /*#__PURE__*/function () {
    var _onsubmit = (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee(event) {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            event.preventDefault();
            _context.prev = 1;
            _context.next = 4;
            return this.attrs.onsubmit(this.data(), this.state);
          case 4:
            _context.next = 9;
            break;
          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](1);
            if (_context.t0 instanceof _form_FormError__WEBPACK_IMPORTED_MODULE_10__["default"]) {
              flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().alerts.show({
                type: 'error'
              }, _context.t0.message);
            } else {
              console.error(_context.t0);
              // Show error alert
              flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().alerts.show({
                type: 'error'
              }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_4___default().translator.trans('fof-polls.forum.modal.error'));
            }
          case 9:
          case "end":
            return _context.stop();
        }
      }, _callee, this, [[1, 6]]);
    }));
    function onsubmit(_x) {
      return _onsubmit.apply(this, arguments);
    }
    return onsubmit;
  }();
  _proto["delete"] = /*#__PURE__*/function () {
    var _delete2 = (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee2() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            this.state.loading = true;
            _context2.prev = 1;
            _context2.next = 4;
            return _utils_PollControls__WEBPACK_IMPORTED_MODULE_12__["default"].deleteAction(this.state.poll);
          case 4:
            this.state.deleting = true;
          case 5:
            _context2.prev = 5;
            this.state.loading = false;
            m.redraw();
            return _context2.finish(5);
          case 9:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this, [[1,, 5, 9]]);
    }));
    function _delete() {
      return _delete2.apply(this, arguments);
    }
    return _delete;
  }();
  _proto.formatDate = function formatDate(date, def) {
    if (date === void 0) {
      date = undefined;
    }
    if (def === void 0) {
      def = false;
    }
    var dayjsDate = dayjs(date);
    if (date === false || !dayjsDate.isValid()) return def !== false ? this.formatDate(def) : false;
    return dayjsDate.format('YYYY-MM-DDTHH:mm');
  };
  _proto.dateToTimestamp = function dateToTimestamp(date) {
    var dayjsDate = dayjs(date);
    if (!date || !dayjsDate.isValid()) return null;
    return dayjsDate.format();
  };
  return PollForm;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_3___default()));


/***/ }),

/***/ "./src/forum/components/PollShowcase.tsx":
/*!***********************************************!*\
  !*** ./src/forum/components/PollShowcase.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PollShowcase)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _PollShowcaseItem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PollShowcaseItem */ "./src/forum/components/PollShowcaseItem.tsx");
/* harmony import */ var flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Placeholder */ "flarum/common/components/Placeholder");
/* harmony import */ var flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_5__);






var PollShowcase = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PollShowcase, _Component);
  function PollShowcase() {
    return _Component.apply(this, arguments) || this;
  }
  var _proto = PollShowcase.prototype;
  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode);
    this.attrs.state.refresh();
  };
  _proto.view = function view() {
    return m("div", {
      className: "PollShowcase"
    }, m("div", {
      className: "PollShowcase-featured"
    }, this.showcaseItems().toArray(), this.showcaseItems().toArray().length === 0 && m((flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_4___default()), {
      text: flarum_forum_app__WEBPACK_IMPORTED_MODULE_5___default().translator.trans('fof-polls.forum.showcase.no-active-polls')
    })), m("div", {
      className: "PollShowcase-ended"
    }, this.endedItems().toArray(), this.endedItems().toArray().length === 0 && m((flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_4___default()), {
      text: flarum_forum_app__WEBPACK_IMPORTED_MODULE_5___default().translator.trans('fof-polls.forum.showcase.no-recent-polls')
    })));
  };
  _proto.showcaseItems = function showcaseItems() {
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_2___default())();
    this.attrs.state.getPages().map(function (page) {
      page.items.map(function (poll) {
        if (!poll.hasEnded()) {
          items.add('poll-active-' + poll.id(), m(_PollShowcaseItem__WEBPACK_IMPORTED_MODULE_3__["default"], {
            poll: poll
          }));
        }
      });
    });
    return items;
  };
  _proto.endedItems = function endedItems() {
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_2___default())();
    this.attrs.state.getPages().map(function (page) {
      page.items.map(function (poll) {
        if (poll.hasEnded()) {
          items.add('poll-ended-' + poll.id(), m(_PollShowcaseItem__WEBPACK_IMPORTED_MODULE_3__["default"], {
            poll: poll
          }));
        }
      });
    });
    return items;
  };
  return PollShowcase;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/PollShowcaseItem.tsx":
/*!***************************************************!*\
  !*** ./src/forum/components/PollShowcaseItem.tsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PollShowcaseItem)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _PollView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PollView */ "./src/forum/components/PollView.tsx");



var PollShowcaseItem = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PollShowcaseItem, _Component);
  function PollShowcaseItem() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.poll = void 0;
    return _this;
  }
  var _proto = PollShowcaseItem.prototype;
  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode);
    this.poll = this.attrs.poll;
  };
  _proto.view = function view() {
    return m(_PollView__WEBPACK_IMPORTED_MODULE_2__["default"], {
      poll: this.poll
    });
  };
  return PollShowcaseItem;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/PollView.tsx":
/*!*******************************************!*\
  !*** ./src/forum/components/PollView.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PollView)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Poll_PollOptions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Poll/PollOptions */ "./src/forum/components/Poll/PollOptions.tsx");
/* harmony import */ var _states_PollState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../states/PollState */ "./src/forum/states/PollState.ts");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _utils_PollControls__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/PollControls */ "./src/forum/utils/PollControls.tsx");
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/components/Dropdown */ "flarum/common/components/Dropdown");
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _Poll_PollSubmitButton__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Poll/PollSubmitButton */ "./src/forum/components/Poll/PollSubmitButton.tsx");
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! flarum/common/utils/string */ "flarum/common/utils/string");
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_10__);











var PollView = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PollView, _Component);
  function PollView() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.state = void 0;
    /**
     * Alert before navigating away using browser's 'beforeunload' event
     */
    _this.preventClose = function (e) {
      if (_this.state.hasSelectedOptions()) {
        e.preventDefault();
        return true;
      }
    };
    return _this;
  }
  var _proto = PollView.prototype;
  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode);
    this.state = new _states_PollState__WEBPACK_IMPORTED_MODULE_4__["default"](this.attrs.poll);
  };
  _proto.oncreate = function oncreate(vnode) {
    _Component.prototype.oncreate.call(this, vnode);
    this.preventClose = this.preventClose.bind(this);
    window.addEventListener('beforeunload', this.preventClose);
  };
  _proto.onremove = function onremove(vnode) {
    _Component.prototype.onremove.call(this, vnode);
    window.removeEventListener('beforeunload', this.preventClose);
  };
  _proto.view = function view() {
    var poll = this.attrs.poll;
    var state = this.state;
    var controls = _utils_PollControls__WEBPACK_IMPORTED_MODULE_7__["default"].controls(poll, this);
    controls.add('view', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default()), {
      onclick: state.showVoters,
      icon: "fas fa-poll"
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('fof-polls.forum.public_poll')));
    return m("div", {
      className: "Poll",
      "data-id": poll.id()
    }, this.controlsView(controls.toArray()), m("div", {
      className: "Poll-wrapper"
    }, this.createMainView().toArray()));
  };
  _proto.createMainView = function createMainView() {
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_6___default())();
    var poll = this.attrs.poll;
    items.add('title', m("h2", {
      className: "Poll-title"
    }, poll.question()));
    items.add('subtitle', m("p", {
      className: "Poll-subtitle"
    }, poll.subtitle()));
    items.add('form', m("form", null, this.createFormItems().toArray()));
    return items;
  };
  _proto.createFormItems = function createFormItems() {
    var state = this.state;
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_6___default())();
    var poll = this.attrs.poll;
    var infoItems = this.infoItems(state.getMaxVotes());
    var questionSlug = (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_10__.slug)(poll.question());
    items.add('elements', m("fieldset", null, m("legend", {
      className: "sr-only"
    }, poll.question()), m(_Poll_PollOptions__WEBPACK_IMPORTED_MODULE_3__["default"], {
      name: questionSlug,
      options: poll.options(),
      state: state
    })));
    items.add('sticky', m("div", {
      className: "Poll-sticky"
    }, !infoItems.isEmpty() && m("div", {
      className: "helpText PollInfoText"
    }, infoItems.toArray()), state.showButton() && m(_Poll_PollSubmitButton__WEBPACK_IMPORTED_MODULE_9__["default"], {
      state: state
    })));
    return items;
  };
  _proto.controlsView = function controlsView(controls) {
    return !!controls.length && m((flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_8___default()), {
      icon: "fas fa-ellipsis-v",
      className: "PollListItem-controls",
      menuClassName: "Dropdown-menu--right",
      buttonClassName: "Button Button--icon Button--flat",
      accessibleToggleLabel: flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('fof-polls.forum.poll_controls.toggle_dropdown_accessible_label')
    }, controls);
  };
  _proto.infoItems = function infoItems(maxVotes) {
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_6___default())();
    var poll = this.attrs.poll;
    if ((flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().session).user && !poll.canVote() && !poll.hasEnded()) {
      items.add('no-permission', m("span", null, m("i", {
        className: "icon fas fa-times-circle fa-fw"
      }), flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('fof-polls.forum.no_permission')));
    }
    if (poll.endDate()) {
      items.add('end-date', m("span", null, m("i", {
        "class": "icon fas fa-clock fa-fw"
      }), poll.hasEnded() ? flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('fof-polls.forum.poll_ended') : flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('fof-polls.forum.days_remaining', {
        time: dayjs(poll.endDate()).fromNow()
      })));
    }
    if (poll.canVote()) {
      items.add('max-votes', m("span", null, m("i", {
        className: "icon fas fa-poll fa-fw"
      }), flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('fof-polls.forum.max_votes_allowed', {
        max: maxVotes
      })));
      if (!poll.canChangeVote()) {
        items.add('cannot-change-vote', m("span", null, m("i", {
          className: "icon fas fa-" + (this.state.hasVoted() ? 'times' : 'exclamation') + "-circle fa-fw"
        }), flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('fof-polls.forum.poll.cannot_change_vote')));
      }
    }
    return items;
  };
  return PollView;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/PollViewPage.tsx":
/*!***********************************************!*\
  !*** ./src/forum/components/PollViewPage.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PollViewPage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _PollView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PollView */ "./src/forum/components/PollView.tsx");
/* harmony import */ var _AbstractPollPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AbstractPollPage */ "./src/forum/components/AbstractPollPage.tsx");




var PollViewPage = /*#__PURE__*/function (_AbstractPollPage) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PollViewPage, _AbstractPollPage);
  function PollViewPage() {
    return _AbstractPollPage.apply(this, arguments) || this;
  }
  var _proto = PollViewPage.prototype;
  _proto.oninit = function oninit(vnode) {
    var _this = this;
    _AbstractPollPage.prototype.oninit.call(this, vnode);
    var editId = m.route.param('id');
    this.poll = flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().store.getById('poll', editId);
    if (!this.poll) {
      this.loading = true;
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().store.find('fof/polls', editId).then(function (item) {
        _this.poll = item;
        _this.loading = false;
        flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().setTitle(_this.poll.question());
        m.redraw();
      });
    }
  };
  _proto.contentItems = function contentItems() {
    var items = _AbstractPollPage.prototype.contentItems.call(this);
    if (!this.loading) {
      items.add('poll', m(_PollView__WEBPACK_IMPORTED_MODULE_2__["default"], {
        poll: this.poll
      }));
    }
    return items;
  };
  return PollViewPage;
}(_AbstractPollPage__WEBPACK_IMPORTED_MODULE_3__.AbstractPollPage);


/***/ }),

/***/ "./src/forum/components/Poll/PollList.tsx":
/*!************************************************!*\
  !*** ./src/forum/components/Poll/PollList.tsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PollList)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _PollListItem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PollListItem */ "./src/forum/components/Poll/PollListItem.tsx");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/components/Placeholder */ "flarum/common/components/Placeholder");
/* harmony import */ var flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_7__);








/**
 * The `PollList` component displays a list of polls.
 */
var PollList = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PollList, _Component);
  function PollList() {
    return _Component.apply(this, arguments) || this;
  }
  var _proto = PollList.prototype;
  _proto.view = function view() {
    var state = this.attrs.state;
    var params = state.getParams();
    var isLoading = state.isInitialLoading() || state.isLoadingNext();
    var loading;
    if (isLoading) {
      loading = m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5___default()), null);
    } else if (state.hasNext()) {
      loading = m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
        className: "Button",
        onclick: state.loadNext.bind(state)
      }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.polls_list.load_more_button'));
    }
    if (state.isEmpty()) {
      var text = flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.polls_list.empty_text');
      return m("div", {
        className: "PollList"
      }, m((flarum_common_components_Placeholder__WEBPACK_IMPORTED_MODULE_6___default()), {
        text: text
      }));
    }
    return m("div", {
      className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_7___default()('PollList', {
        'PollList--searchResults': state.isSearchResults()
      })
    }, m("ul", {
      "aria-busy": isLoading,
      className: "PollList-polls"
    }, state.getPages().map(function (pg) {
      return pg.items.map(function (poll) {
        return m("li", {
          key: poll.id(),
          "data-id": poll.id()
        }, m(_PollListItem__WEBPACK_IMPORTED_MODULE_3__["default"], {
          poll: poll,
          params: params
        }));
      });
    })), m("div", {
      className: "PollList-loadMore"
    }, loading));
  };
  return PollList;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default()));


/***/ }),

/***/ "./src/forum/components/Poll/PollListItem.tsx":
/*!****************************************************!*\
  !*** ./src/forum/components/Poll/PollListItem.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PollListItem)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_utils_SubtreeRetainer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/utils/SubtreeRetainer */ "flarum/common/utils/SubtreeRetainer");
/* harmony import */ var flarum_common_utils_SubtreeRetainer__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_SubtreeRetainer__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Dropdown */ "flarum/common/components/Dropdown");
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_helpers_highlight__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/helpers/highlight */ "flarum/common/helpers/highlight");
/* harmony import */ var flarum_common_helpers_highlight__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_highlight__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_forum_utils_slidable__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/forum/utils/slidable */ "flarum/forum/utils/slidable");
/* harmony import */ var flarum_forum_utils_slidable__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_utils_slidable__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! flarum/common/utils/abbreviateNumber */ "flarum/common/utils/abbreviateNumber");
/* harmony import */ var flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _utils_PollControls__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../utils/PollControls */ "./src/forum/utils/PollControls.tsx");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! flarum/common/helpers/listItems */ "flarum/common/helpers/listItems");
/* harmony import */ var flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _PollViewPage__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../PollViewPage */ "./src/forum/components/PollViewPage.tsx");















/**
 * The `PollListItem` component shows a single poll in the
 * poll list.
 */
var PollListItem = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PollListItem, _Component);
  function PollListItem() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    /**
     * Ensures that the poll will not be redrawn
     * unless new data comes in.
     */
    _this.subtree = void 0;
    _this.poll = void 0;
    _this.highlightRegExp = void 0;
    return _this;
  }
  var _proto = PollListItem.prototype;
  _proto.oninit = function oninit(vnode) {
    var _this2 = this;
    _Component.prototype.oninit.call(this, vnode);
    this.poll = this.attrs.poll;
    this.subtree = new (flarum_common_utils_SubtreeRetainer__WEBPACK_IMPORTED_MODULE_3___default())(function () {
      return _this2.poll.freshness;
    }, function () {
      var time = (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session).user && flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session.user.markedAllAsReadAt();
      return time && time.getTime();
    }, function () {
      return _this2.active();
    });
  };
  _proto.elementAttrs = function elementAttrs() {
    return {
      className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4___default()('PollListItem', {
        active: this.active(),
        'PollListItem--hidden': this.poll.isHidden(),
        Slidable: 'ontouchstart' in window
      })
    };
  };
  _proto.view = function view() {
    var controls = _utils_PollControls__WEBPACK_IMPORTED_MODULE_11__["default"].controls(this.poll, this).toArray();
    var attrs = this.elementAttrs();
    return m("div", attrs, this.controlsView(controls), this.contentView(), this.slidableUnderneathView());
  };
  _proto.controlsView = function controlsView(controls) {
    return !!controls.length && m((flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_5___default()), {
      icon: "fas fa-ellipsis-v",
      className: "PollListItem-controls",
      menuClassName: "Dropdown-menu--right",
      buttonClassName: "Button Button--icon Button--flat",
      accessibleToggleLabel: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.poll_controls.toggle_dropdown_accessible_label')
    }, controls);
  };
  _proto.slidableUnderneathView = function slidableUnderneathView() {
    var isUnread = this.poll.isUnread();
    return m("span", {
      className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4___default()('Slidable-underneath Slidable-underneath--left Slidable-underneath--elastic', {
        disabled: !isUnread
      }),
      onclick: this.markAsRead.bind(this)
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_9___default()('fas fa-check'));
  };
  _proto.contentView = function contentView() {
    // const isUnread = this.poll.isUnread();
    // const isRead = this.poll.isRead();

    return (
      //   <div className={classList('PollListItem-content', 'Slidable-content', { unread: isUnread, read: isRead })}>
      m("div", {
        className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4___default()('PollListItem-content')
      }, this.mainView())
    );
  };
  _proto.mainView = function mainView() {
    return m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_6___default()), {
      href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().route('fof.polls.view', {
        id: this.poll.id()
      }),
      className: "PollListItem-main"
    }, m("h2", {
      className: "PollListItem-title"
    }, flarum_common_helpers_highlight__WEBPACK_IMPORTED_MODULE_7___default()(this.poll.question(), this.highlightRegExp)), this.poll.subtitle() && m("p", {
      className: "PollListItem-subtitle helpText"
    }, this.poll.subtitle()), m("ul", {
      className: "PollListItem-info"
    }, flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_13___default()(this.infoItems().toArray())));
  }

  // infoView() {
  //   return (
  //     <div>
  //       {this.poll.subtitle() && <p className="PollListItem-subtitle helpText">{this.poll.subtitle()}</p>}
  //       <ul className="PollListItem-info">{listItems(this.infoItems().toArray())}</ul>
  //     </div>
  //   );
  // }
  ;
  _proto.oncreate = function oncreate(vnode) {
    _Component.prototype.oncreate.call(this, vnode);

    // If we're on a touch device, set up the discussion row to be slidable.
    // This allows the user to drag the row to either side of the screen to
    // reveal controls.
    if ('ontouchstart' in window) {
      var slidableInstance = flarum_forum_utils_slidable__WEBPACK_IMPORTED_MODULE_8___default()(this.element);
      this.$('.PollListItem-controls').on('hidden.bs.dropdown', function () {
        return slidableInstance.reset();
      });
    }
  };
  _proto.onbeforeupdate = function onbeforeupdate(vnode) {
    _Component.prototype.onbeforeupdate.call(this, vnode);
    return this.subtree.needsRebuild();
  }

  /**
   * Determine whether or not the discussion is currently being viewed.
   */;
  _proto.active = function active() {
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().current.matches(_PollViewPage__WEBPACK_IMPORTED_MODULE_14__["default"], {
      poll: this.poll
    });
  }

  /**
   * Mark the poll as read.
   */;
  _proto.markAsRead = function markAsRead() {
    if (this.poll.isUnread()) {
      this.poll.save({
        lastVotedNumber: this.poll.voteCount()
      });
      m.redraw();
    }
  };
  _proto.infoItems = function infoItems() {
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_12___default())();
    var active = !this.poll.hasEnded();
    var activeView = this.poll.endDate() ? [flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_9___default()('fas fa-clock'), ' ', active ? flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.days_remaining', {
      time: dayjs(this.poll.endDate()).fromNow()
    }) : flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.poll_ended')] : [flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_9___default()('fas fa-infinity'), ' ', flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.poll_never_ends')];
    items.add('active', m("span", {
      className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4___default()('PollListItem-endStatus', {
        active: active
      })
    }, activeView));
    var voteCount = this.poll.voteCount();
    if (voteCount !== undefined) {
      items.add('voteCount', m("span", null, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_9___default()('fas fa-poll fa-fw'), [' ', flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.polls_count', {
        count: flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_10___default()(voteCount)
      })]), 70);
    }
    return items;
  };
  return PollListItem;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default()));


/***/ }),

/***/ "./src/forum/components/Poll/PollOption.tsx":
/*!**************************************************!*\
  !*** ./src/forum/components/Poll/PollOption.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PollOption)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Tooltip */ "flarum/common/components/Tooltip");
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5__);






var PollOption = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PollOption, _Component);
  function PollOption() {
    return _Component.apply(this, arguments) || this;
  }
  var _proto = PollOption.prototype;
  _proto.view = function view() {
    var _poll$myVotes;
    var option = this.attrs.option;
    var state = this.attrs.state;
    var hasVoted = state.hasVoted();
    var totalVotes = state.overallVoteCount();
    var votes = option.voteCount();
    var voted = state.hasVotedFor(option);
    var percent = totalVotes > 0 ? Math.round(votes / totalVotes * 100) : 0;

    // @ts-ignore
    var poll = state.poll;

    // isNaN(null) is false, so we have to check type directly now that API always returns the field
    var canSeeVoteCount = typeof votes === 'number';
    var isDisabled = state.loadingOptions || hasVoted && !poll.canChangeVote();
    var width = canSeeVoteCount ? percent : Number(voted) / (((_poll$myVotes = poll.myVotes()) == null ? void 0 : _poll$myVotes.length) || 1) * 100;
    var bar = m("div", {
      className: "PollBar",
      "data-selected": !!voted,
      style: "--poll-option-width: " + width + "%"
    }, state.showCheckMarks && m("label", {
      className: "PollAnswer-checkbox checkbox"
    }, m("input", {
      onchange: state.changeVote.bind(state, option),
      type: "checkbox",
      checked: voted,
      disabled: isDisabled
    }), m("span", {
      className: "checkmark"
    })), m("div", {
      className: "PollAnswer-text"
    }, m("span", {
      className: "PollAnswer-text-answer"
    }, option.answer()), voted && !state.showCheckMarks && flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_4___default()('fas fa-check-circle', {
      className: 'PollAnswer-check'
    }), canSeeVoteCount && m("span", {
      className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5___default()('PollPercent', percent !== 100 && 'PollPercent--option')
    }, percent, "%")), option.imageUrl() ? m("img", {
      className: "PollAnswer-image",
      src: option.imageUrl(),
      alt: option.answer()
    }) : null);
    return m("div", {
      className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5___default()('PollOption', hasVoted && 'PollVoted', option.imageUrl() && 'PollOption-hasImage'),
      "data-id": option.id()
    }, canSeeVoteCount ? m((flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_3___default()), {
      text: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.tooltip.votes', {
        count: votes
      }),
      onremove: this.hideOptionTooltip
    }, bar) : bar);
  }

  /**
   * Attempting to use the `tooltipVisible` attr on the Tooltip component set to 'false' when no vote count
   * caused the tooltip to break on click. This is a workaround to hide the tooltip when no vote count is available,
   * called on 'onremove' of the Tooltip component. It doesn't always work as intended either, but it does the job.
   */;
  _proto.hideOptionTooltip = function hideOptionTooltip(vnode) {
    vnode.attrs.tooltipVisible = false;

    // @ts-ignore
    vnode.state.updateVisibility();
  };
  return PollOption;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default()));


/***/ }),

/***/ "./src/forum/components/Poll/PollOptions.tsx":
/*!***************************************************!*\
  !*** ./src/forum/components/Poll/PollOptions.tsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PollOptions)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _PollOption__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PollOption */ "./src/forum/components/Poll/PollOption.tsx");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_3__);




var PollOptions = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PollOptions, _Component);
  function PollOptions() {
    return _Component.apply(this, arguments) || this;
  }
  var _proto = PollOptions.prototype;
  _proto.view = function view() {
    return m("div", {
      className: "Poll-options list-layout"
    }, this.pollOptions().toArray());
  };
  _proto.pollOptions = function pollOptions() {
    var _this = this;
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_3___default())();
    this.attrs.options.forEach(function (option) {
      items.add('option' + option.id(), _this.createOptionView(option));
    });
    return items;
  };
  _proto.createOptionView = function createOptionView(option) {
    return m(_PollOption__WEBPACK_IMPORTED_MODULE_2__["default"], {
      name: this.attrs.name,
      option: option,
      state: this.attrs.state
    });
  };
  return PollOptions;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/Poll/PollSubmitButton.tsx":
/*!********************************************************!*\
  !*** ./src/forum/components/Poll/PollSubmitButton.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PollSubmitButton)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__);




var PollSubmitButton = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PollSubmitButton, _Component);
  function PollSubmitButton() {
    return _Component.apply(this, arguments) || this;
  }
  var _proto = PollSubmitButton.prototype;
  _proto.view = function view() {
    var _this = this;
    var state = this.attrs.state;
    return m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: "Button Button--primary Poll-submit",
      loading: state.loadingOptions,
      onclick: function onclick(event) {
        return _this.pollButtonSubmit(state, event);
      },
      disabled: !state.hasSelectedOptions()
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.poll.submit_button'));
  }

  /**
   * Event handler for submit button being clicked
   */;
  _proto.pollButtonSubmit = function pollButtonSubmit(state, event) {
    state.onsubmit();
  };
  return PollSubmitButton;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default()));


/***/ }),

/***/ "./src/forum/components/PollsPage.tsx":
/*!********************************************!*\
  !*** ./src/forum/components/PollsPage.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PollsPage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/helpers/listItems */ "flarum/common/helpers/listItems");
/* harmony import */ var flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/forum/components/IndexPage */ "flarum/forum/components/IndexPage");
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Poll_PollList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Poll/PollList */ "./src/forum/components/Poll/PollList.tsx");
/* harmony import */ var flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/forum/components/LogInModal */ "flarum/forum/components/LogInModal");
/* harmony import */ var flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/utils/extractText */ "flarum/common/utils/extractText");
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _states_PollListState__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../states/PollListState */ "./src/forum/states/PollListState.ts");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var flarum_common_components_SelectDropdown__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! flarum/common/components/SelectDropdown */ "flarum/common/components/SelectDropdown");
/* harmony import */ var flarum_common_components_SelectDropdown__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_SelectDropdown__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _PollView__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./PollView */ "./src/forum/components/PollView.tsx");
/* harmony import */ var _AbstractPollPage__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./AbstractPollPage */ "./src/forum/components/AbstractPollPage.tsx");














var PollsPage = /*#__PURE__*/function (_AbstractPollPage) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PollsPage, _AbstractPollPage);
  function PollsPage() {
    return _AbstractPollPage.apply(this, arguments) || this;
  }
  var _proto = PollsPage.prototype;
  _proto.oninit = function oninit(vnode) {
    _AbstractPollPage.prototype.oninit.call(this, vnode);
    this.state = new _states_PollListState__WEBPACK_IMPORTED_MODULE_8__["default"]({
      sort: m.route.param('sort'),
      filter: m.route.param('filter')
    });
    this.state.refresh();
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().setTitle(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_7___default()(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.page.nav')));
  };
  _proto.view = function view() {
    if (this.loading) {
      return m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_11___default()), null);
    }
    if (this.poll) {
      return m("div", {
        className: "PollsListPage"
      }, m("div", {
        className: "container"
      }, m(_PollView__WEBPACK_IMPORTED_MODULE_12__["default"], {
        poll: this.poll
      })));
    }
    return m("div", {
      className: "PollsListPage"
    }, _AbstractPollPage.prototype.hero.call(this), m("div", {
      className: "container"
    }, m("div", {
      className: "sideNavContainer"
    }, m("nav", {
      className: "PollsListPage-nav sideNav"
    }, m("ul", null, flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_2___default()(this.sidebarItems().toArray()))), m("div", {
      className: "PollsPage-results sideNavOffset"
    }, m("div", {
      className: "IndexPage-toolbar"
    }, m("ul", {
      className: "IndexPage-toolbar-view"
    }, flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_2___default()(this.viewItems().toArray())), m("ul", {
      className: "IndexPage-toolbar-action"
    }, flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_2___default()(this.actionItems().toArray()))), m(_Poll_PollList__WEBPACK_IMPORTED_MODULE_5__["default"], {
      state: this.state
    })))));
  };
  _proto.sidebarItems = function sidebarItems() {
    var _this = this;
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_3___default())();
    var canStartPoll = flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('canStartGlobalPolls');
    items.add('newGlobalPoll', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_9___default()), {
      icon: "fas fa-edit",
      className: "Button Button--primary App-primaryControl PollsPage-newPoll",
      itemClassName: "App-primaryControl",
      onclick: function onclick() {
        _this.newPollAction();
      },
      disabled: !canStartPoll
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("fof-polls.forum.poll." + (canStartPoll ? 'start_poll_button' : 'cannot_start_poll_button'))));
    items.add('nav', m((flarum_common_components_SelectDropdown__WEBPACK_IMPORTED_MODULE_10___default()), {
      buttonClassName: "Button",
      className: "App-titleControl",
      accessibleToggleLabel: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('core.forum.index.toggle_sidenav_dropdown_accessible_label')
    }, this.navItems().toArray()));
    return items;
  };
  _proto.actionItems = function actionItems() {
    var _this2 = this;
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_3___default())();
    items.add('refresh', flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_9___default().component({
      title: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.page.refresh_tooltip'),
      icon: 'fas fa-sync',
      className: 'Button Button--icon',
      onclick: function onclick() {
        _this2.state.refresh();
      }
    }));
    return items;
  };
  _proto.viewItems = function viewItems() {
    return flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4___default().prototype.viewItems();
  };
  _proto.navItems = function navItems() {
    return flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4___default().prototype.navItems();
  }

  /**
   * Change to create new poll page
   */;
  _proto.newPollAction = function newPollAction() {
    if (!(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session).user) {
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().modal.show((flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_6___default()));
      return;
    }
    m.route.set(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().route('fof.polls.compose'));
  };
  return PollsPage;
}(_AbstractPollPage__WEBPACK_IMPORTED_MODULE_13__.AbstractPollPage);


/***/ }),

/***/ "./src/forum/components/PollsShowcasePage.tsx":
/*!****************************************************!*\
  !*** ./src/forum/components/PollsShowcasePage.tsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PollsShowcasePage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _states_PollListState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../states/PollListState */ "./src/forum/states/PollListState.ts");
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/utils/extractText */ "flarum/common/utils/extractText");
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/forum/components/LogInModal */ "flarum/forum/components/LogInModal");
/* harmony import */ var flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _AbstractPollPage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./AbstractPollPage */ "./src/forum/components/AbstractPollPage.tsx");
/* harmony import */ var _PollShowcase__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./PollShowcase */ "./src/forum/components/PollShowcase.tsx");








var PollsShowcasePage = /*#__PURE__*/function (_AbstractPollPage) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PollsShowcasePage, _AbstractPollPage);
  function PollsShowcasePage() {
    return _AbstractPollPage.apply(this, arguments) || this;
  }
  var _proto = PollsShowcasePage.prototype;
  _proto.oninit = function oninit(vnode) {
    _AbstractPollPage.prototype.oninit.call(this, vnode);
    this.state = new _states_PollListState__WEBPACK_IMPORTED_MODULE_2__["default"]({
      sort: m.route.param('sort'),
      filter: m.route.param('filter'),
      include: ['options', 'votes', 'myVotes']
    });
    this.state.refresh();
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().setTitle(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_3___default()(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.page.nav')));
  };
  _proto.contentItems = function contentItems() {
    var items = _AbstractPollPage.prototype.contentItems.call(this);
    if (!this.loading) {
      items.add('poll-showcase', m(_PollShowcase__WEBPACK_IMPORTED_MODULE_7__["default"], {
        state: this.state
      }));
    }
    return items;
  };
  _proto.sidebarItems = function sidebarItems() {
    var _this = this;
    var items = _AbstractPollPage.prototype.sidebarItems.call(this);
    var canStartPoll = flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('canStartGlobalPolls');
    if (canStartPoll) {
      items.remove('newDiscussion');
      items.add('newGlobalPoll', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
        icon: "fas fa-edit",
        className: "Button Button--primary App-primaryControl PollsPage-newPoll",
        itemClassName: "App-primaryControl",
        onclick: function onclick() {
          _this.newPollAction();
        },
        disabled: !canStartPoll
      }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans("fof-polls.forum.poll." + (canStartPoll ? 'start_poll_button' : 'cannot_start_poll_button'))), 100);
    }
    return items;
  };
  _proto.newPollAction = function newPollAction() {
    if (!(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session).user) {
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().modal.show((flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_5___default()));
      return;
    }
    m.route.set(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().route('fof.polls.compose'));
  };
  return PollsShowcasePage;
}(_AbstractPollPage__WEBPACK_IMPORTED_MODULE_6__.AbstractPollPage);


/***/ }),

/***/ "./src/forum/components/PostPoll.tsx":
/*!*******************************************!*\
  !*** ./src/forum/components/PostPoll.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PostPoll)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/forum/components/LogInModal */ "flarum/forum/components/LogInModal");
/* harmony import */ var flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _ListVotersModal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ListVotersModal */ "./src/forum/components/ListVotersModal.tsx");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/components/Tooltip */ "flarum/common/components/Tooltip");
/* harmony import */ var flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _EditPollModal__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./EditPollModal */ "./src/forum/components/EditPollModal.tsx");
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! flarum/common/utils/extractText */ "flarum/common/utils/extractText");
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_11__);












var PostPoll = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PostPoll, _Component);
  function PostPoll() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Component.call.apply(_Component, [this].concat(args)) || this;
    _this.loadingOptions = false;
    _this.useSubmitUI = void 0;
    _this.pendingSubmit = false;
    _this.pendingOptions = void 0;
    return _this;
  }
  var _proto = PostPoll.prototype;
  _proto.oninit = function oninit(vnode) {
    var _this$attrs$poll, _this$attrs$poll2;
    _Component.prototype.oninit.call(this, vnode);
    this.useSubmitUI = !((_this$attrs$poll = this.attrs.poll) != null && _this$attrs$poll.canChangeVote()) && ((_this$attrs$poll2 = this.attrs.poll) == null ? void 0 : _this$attrs$poll2.allowMultipleVotes());
    this.pendingOptions = null;
  };
  _proto.oncreate = function oncreate(vnode) {
    _Component.prototype.oncreate.call(this, vnode);
    this.preventClose = this.preventClose.bind(this);
    window.addEventListener('beforeunload', this.preventClose);
  };
  _proto.onremove = function onremove(vnode) {
    _Component.prototype.onremove.call(this, vnode);
    window.removeEventListener('beforeunload', this.preventClose);
  };
  _proto.view = function view() {
    var poll = this.attrs.poll;
    var options = poll.options() || [];
    var maxVotes = poll.allowMultipleVotes() ? poll.maxVotes() : 1;
    if (maxVotes === 0) maxVotes = options.length;
    var infoItems = this.infoItems(maxVotes);
    return m("div", {
      className: "Post-poll",
      "data-id": poll.id()
    }, m("div", {
      className: "PollHeading"
    }, m("div", {
      className: "PollHeading-title-container"
    }, m("h3", {
      className: "PollHeading-title"
    }, poll.question()), poll.subtitle() && m("p", {
      className: "helpText PollHeading-subtitle"
    }, poll.subtitle())), m("div", {
      className: "PollHeading-actions"
    }, poll.canSeeVoters() && m((flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_8___default()), {
      text: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.public_poll')
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: "Button PollHeading-voters",
      onclick: this.showVoters.bind(this),
      icon: "fas fa-poll"
    })), poll.canEdit() && m((flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_8___default()), {
      text: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.moderation.edit')
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: "Button PollHeading-edit",
      onclick: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().modal.show.bind((flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().modal), _EditPollModal__WEBPACK_IMPORTED_MODULE_10__["default"], {
        poll: poll
      }),
      icon: "fas fa-pen"
    })), poll.canDelete() && m((flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_8___default()), {
      text: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.moderation.delete')
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: "Button PollHeading-delete",
      onclick: this.deletePoll.bind(this),
      icon: "fas fa-trash"
    })))), m("div", null, m("div", {
      className: "PollOptions"
    }, options.map(this.viewOption.bind(this))), m("div", {
      className: "Poll-sticky"
    }, !infoItems.isEmpty() && m("div", {
      className: "helpText PollInfoText"
    }, infoItems.toArray()), this.useSubmitUI && this.pendingSubmit && m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()), {
      className: "Button Button--primary Poll-submit",
      loading: this.loadingOptions,
      onclick: this.onsubmit.bind(this)
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.poll.submit_button')))));
  };
  _proto.infoItems = function infoItems(maxVotes) {
    var _poll$myVotes;
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_7___default())();
    var poll = this.attrs.poll;
    var hasVoted = ((_poll$myVotes = poll.myVotes()) == null ? void 0 : _poll$myVotes.length) > 0;
    if ((flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session).user && !poll.canVote() && !poll.hasEnded()) {
      items.add('no-permission', m("span", null, m("i", {
        className: "icon fas fa-times-circle fa-fw"
      }), flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.no_permission')));
    }
    if (poll.endDate()) {
      items.add('end-date', m("span", null, m("i", {
        "class": "icon fas fa-clock fa-fw"
      }), poll.hasEnded() ? flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.poll_ended') : flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.days_remaining', {
        time: dayjs(poll.endDate()).fromNow()
      })));
    }
    if (poll.canVote()) {
      items.add('max-votes', m("span", null, m("i", {
        className: "icon fas fa-poll fa-fw"
      }), flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.max_votes_allowed', {
        max: maxVotes
      })));
      if (!poll.canChangeVote()) {
        items.add('cannot-change-vote', m("span", null, m("i", {
          className: "icon fas fa-" + (hasVoted ? 'times' : 'exclamation') + "-circle fa-fw"
        }), flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.poll.cannot_change_vote')));
      }
    }
    return items;
  };
  _proto.viewOption = function viewOption(opt) {
    var _poll$myVotes2, _poll$myVotes3, _poll$myVotes4;
    var poll = this.attrs.poll;
    var hasVoted = ((_poll$myVotes2 = poll.myVotes()) == null ? void 0 : _poll$myVotes2.length) > 0;
    var totalVotes = poll.voteCount();
    var voted = this.pendingOptions ? this.pendingOptions.has(opt.id()) : (_poll$myVotes3 = poll.myVotes()) == null || _poll$myVotes3.some == null ? void 0 : _poll$myVotes3.some(function (vote) {
      return vote.option() === opt;
    });
    var votes = opt.voteCount();
    var percent = totalVotes > 0 ? Math.round(votes / totalVotes * 100) : 0;

    // isNaN(null) is false, so we have to check type directly now that API always returns the field
    var canSeeVoteCount = typeof votes === 'number';
    var isDisabled = this.loadingOptions || hasVoted && !poll.canChangeVote();
    var width = canSeeVoteCount ? percent : Number(voted) / (((_poll$myVotes4 = poll.myVotes()) == null ? void 0 : _poll$myVotes4.length) || 1) * 100;
    var showCheckmark = !(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session).user || !poll.hasEnded() && poll.canVote() && (!hasVoted || poll.canChangeVote());
    var bar = m("div", {
      className: "PollBar",
      "data-selected": !!voted,
      style: "--poll-option-width: " + width + "%"
    }, showCheckmark && m("label", {
      className: "PollAnswer-checkbox checkbox"
    }, m("input", {
      onchange: this.changeVote.bind(this, opt),
      type: "checkbox",
      checked: voted,
      disabled: isDisabled
    }), m("span", {
      className: "checkmark"
    })), m("div", {
      className: "PollAnswer-text"
    }, m("span", {
      className: "PollAnswer-text-answer"
    }, opt.answer()), voted && !showCheckmark && flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_9___default()('fas fa-check-circle', {
      className: 'PollAnswer-check'
    }), canSeeVoteCount && m("span", {
      className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_6___default()('PollPercent', percent !== 100 && 'PollPercent--option')
    }, percent, "%")), opt.imageUrl() ? m("img", {
      className: "PollAnswer-image",
      src: opt.imageUrl(),
      alt: opt.answer()
    }) : null);
    return m("div", {
      className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_6___default()('PollOption', hasVoted && 'PollVoted', poll.hasEnded() && 'PollEnded', opt.imageUrl() && 'PollOption-hasImage'),
      "data-id": opt.id()
    }, canSeeVoteCount ? m((flarum_common_components_Tooltip__WEBPACK_IMPORTED_MODULE_8___default()), {
      text: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.tooltip.votes', {
        count: votes
      }),
      onremove: this.hideOptionTooltip
    }, bar) : bar);
  };
  _proto.changeVote = function changeVote(option, evt) {
    var _this$attrs$poll$myVo, _this$attrs$poll$myVo2;
    if (!(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session).user) {
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().modal.show((flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_4___default()));
      evt.target.checked = false;
      return;
    }
    var optionIds = this.pendingOptions || new Set((_this$attrs$poll$myVo = (_this$attrs$poll$myVo2 = this.attrs.poll.myVotes()).map) == null ? void 0 : _this$attrs$poll$myVo.call(_this$attrs$poll$myVo2, function (v) {
      return v.option().id();
    }));
    var isUnvoting = optionIds["delete"](option.id());
    var allowsMultiple = this.attrs.poll.allowMultipleVotes();
    if (!allowsMultiple) {
      optionIds.clear();
    }
    if (!isUnvoting) {
      optionIds.add(option.id());
    }
    if (this.useSubmitUI) {
      this.pendingOptions = optionIds.size ? optionIds : null;
      this.pendingSubmit = !!this.pendingOptions;
      return;
    }
    return this.submit(optionIds, null, function () {
      return evt.target.checked = isUnvoting;
    });
  };
  _proto.onsubmit = function onsubmit() {
    var _this2 = this;
    return this.submit(this.pendingOptions, function () {
      _this2.pendingOptions = null;
      _this2.pendingSubmit = false;
    });
  };
  _proto.submit = function submit(optionIds, cb, onerror) {
    var _this3 = this;
    this.loadingOptions = true;
    m.redraw();
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().request({
      method: 'PATCH',
      url: flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('apiUrl') + "/fof/polls/" + this.attrs.poll.id() + "/votes",
      body: {
        data: {
          optionIds: Array.from(optionIds)
        }
      }
    }).then(function (res) {
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().store.pushPayload(res);
      cb == null || cb();
    })["catch"](function (err) {
      onerror == null || onerror(err);
    })["finally"](function () {
      _this3.loadingOptions = false;
      m.redraw();
    });
  };
  _proto.showVoters = function showVoters() {
    // Load all the votes only when opening the votes list
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().modal.show(_ListVotersModal__WEBPACK_IMPORTED_MODULE_5__["default"], {
      poll: this.attrs.poll,
      post: this.attrs.post
    });
  };
  _proto.deletePoll = function deletePoll() {
    if (confirm(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_11___default()(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-polls.forum.moderation.delete_confirm')))) {
      this.attrs.poll["delete"]().then(function () {
        m.redraw.sync();
      });
    }
  }

  /**
   * Attempting to use the `tooltipVisible` attr on the Tooltip component set to 'false' when no vote count
   * caused the tooltip to break on click. This is a workaround to hide the tooltip when no vote count is available,
   * called on 'onremove' of the Tooltip component. It doesn't always work as intended either, but it does the job.
   */;
  _proto.hideOptionTooltip = function hideOptionTooltip(vnode) {
    vnode.attrs.tooltipVisible = false;
    vnode.state.updateVisibility();
  }

  /**
   * Alert before navigating away using browser's 'beforeunload' event
   */;
  _proto.preventClose = function preventClose(e) {
    if (this.pendingOptions) {
      e.preventDefault();
      return true;
    }
  };
  return PostPoll;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default()));


/***/ }),

/***/ "./src/forum/components/UploadPollImageButton.tsx":
/*!********************************************************!*\
  !*** ./src/forum/components/UploadPollImageButton.tsx ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UploadPollImageButton)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4__);





var UploadPollImageButton = /*#__PURE__*/function (_Button) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(UploadPollImageButton, _Button);
  function UploadPollImageButton() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Button.call.apply(_Button, [this].concat(args)) || this;
    _this.loading = false;
    return _this;
  }
  var _proto = UploadPollImageButton.prototype;
  _proto.view = function view(vnode) {
    var _this$attrs$poll;
    this.attrs.loading = this.loading;
    this.attrs.className = flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4___default()(this.attrs.className, 'Button');
    if ((_this$attrs$poll = this.attrs.poll) != null && _this$attrs$poll.imageUrl()) {
      this.attrs.onclick = this.remove.bind(this);
      return m("div", null, m("p", null, m("img", {
        src: flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().forum.attribute(this.attrs.name + 'Url'),
        alt: ""
      })), m("p", null, _Button.prototype.view.call(this, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, vnode, {
        children: flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('fof-polls.upload_image.remove_button')
      }))));
    } else {
      this.attrs.onclick = this.upload.bind(this);
    }
    return _Button.prototype.view.call(this, (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, vnode, {
      children: flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans('fof-polls.forum.upload_image.upload_button')
    }));
  }

  /**
   * Prompt the user to upload an image.
   */;
  _proto.upload = function upload() {
    var _this2 = this;
    if (this.loading) return;
    var $input = $('<input type="file">');
    $input.appendTo('body').hide().trigger('click').on('change', function (e) {
      var body = new FormData();
      body.append(_this2.attrs.name, $(e.target)[0].files[0]);
      _this2.loading = true;
      m.redraw();
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().request({
        method: 'POST',
        url: _this2.resourceUrl(),
        serialize: function serialize(raw) {
          return raw;
        },
        body: body
      }).then(_this2.success.bind(_this2), _this2.failure.bind(_this2));
    });
  }

  /**
   * Remove the image.
   */;
  _proto.remove = function remove() {
    this.loading = true;
    m.redraw();
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().request({
      method: 'DELETE',
      url: this.resourceUrl()
    }).then(this.success.bind(this), this.failure.bind(this));
  };
  _proto.resourceUrl = function resourceUrl() {
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().forum.attribute('apiUrl') + '/' + this.attrs.name;
  }

  /**
   * After a successful upload/removal, reload the page.
   *
   * @param {object} response
   * @protected
   */;
  _proto.success = function success(response) {
    window.location.reload();
  }

  /**
   * If upload/removal fails, stop loading.
   *
   * @param {object} response
   * @protected
   */;
  _proto.failure = function failure(response) {
    this.loading = false;
    m.redraw();
  };
  return UploadPollImageButton;
}((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_3___default()));


/***/ }),

/***/ "./src/forum/components/form/FormError.tsx":
/*!*************************************************!*\
  !*** ./src/forum/components/form/FormError.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FormError)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var _babel_runtime_helpers_esm_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/wrapNativeSuper */ "./node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js");


var FormError = /*#__PURE__*/function (_Error) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(FormError, _Error);
  function FormError(props) {
    return _Error.call(this, props + '') || this;
  }
  return FormError;
}( /*#__PURE__*/(0,_babel_runtime_helpers_esm_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_1__["default"])(Error));


/***/ }),

/***/ "./src/forum/components/index.ts":
/*!***************************************!*\
  !*** ./src/forum/components/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: () => (/* binding */ components)
/* harmony export */ });
/* harmony import */ var _CreatePollModal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreatePollModal */ "./src/forum/components/CreatePollModal.tsx");
/* harmony import */ var _PostPoll__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PostPoll */ "./src/forum/components/PostPoll.tsx");
/* harmony import */ var _EditPollModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EditPollModal */ "./src/forum/components/EditPollModal.tsx");
/* harmony import */ var _ListVotersModal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ListVotersModal */ "./src/forum/components/ListVotersModal.tsx");
/* harmony import */ var _PollForm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./PollForm */ "./src/forum/components/PollForm.tsx");
/* harmony import */ var _ComposePollHero__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ComposePollHero */ "./src/forum/components/ComposePollHero.tsx");
/* harmony import */ var _ComposePollPage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ComposePollPage */ "./src/forum/components/ComposePollPage.tsx");
/* harmony import */ var _PollsPage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./PollsPage */ "./src/forum/components/PollsPage.tsx");
/* harmony import */ var _PollView__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./PollView */ "./src/forum/components/PollView.tsx");
/* harmony import */ var _PollViewPage__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./PollViewPage */ "./src/forum/components/PollViewPage.tsx");
/* harmony import */ var _Poll_PollSubmitButton__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Poll/PollSubmitButton */ "./src/forum/components/Poll/PollSubmitButton.tsx");
/* harmony import */ var _Poll_PollOptions__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Poll/PollOptions */ "./src/forum/components/Poll/PollOptions.tsx");
/* harmony import */ var _PollsShowcasePage__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./PollsShowcasePage */ "./src/forum/components/PollsShowcasePage.tsx");
/* harmony import */ var _PollShowcase__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./PollShowcase */ "./src/forum/components/PollShowcase.tsx");
/* harmony import */ var _PollShowcaseItem__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./PollShowcaseItem */ "./src/forum/components/PollShowcaseItem.tsx");
/* harmony import */ var _AbstractPollPage__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./AbstractPollPage */ "./src/forum/components/AbstractPollPage.tsx");
















var components = {
  CreatePollModal: _CreatePollModal__WEBPACK_IMPORTED_MODULE_0__["default"],
  PostPoll: _PostPoll__WEBPACK_IMPORTED_MODULE_1__["default"],
  EditPollModal: _EditPollModal__WEBPACK_IMPORTED_MODULE_2__["default"],
  ListVotersModal: _ListVotersModal__WEBPACK_IMPORTED_MODULE_3__["default"],
  PollForm: _PollForm__WEBPACK_IMPORTED_MODULE_4__["default"],
  ComposePollHero: _ComposePollHero__WEBPACK_IMPORTED_MODULE_5__["default"],
  ComposePollPage: _ComposePollPage__WEBPACK_IMPORTED_MODULE_6__["default"],
  PollsPage: _PollsPage__WEBPACK_IMPORTED_MODULE_7__["default"],
  PollView: _PollView__WEBPACK_IMPORTED_MODULE_8__["default"],
  PollViewPage: _PollViewPage__WEBPACK_IMPORTED_MODULE_9__["default"],
  PollSubmitButton: _Poll_PollSubmitButton__WEBPACK_IMPORTED_MODULE_10__["default"],
  PollOptions: _Poll_PollOptions__WEBPACK_IMPORTED_MODULE_11__["default"],
  PollsShowcasePage: _PollsShowcasePage__WEBPACK_IMPORTED_MODULE_12__["default"],
  PollShowcase: _PollShowcase__WEBPACK_IMPORTED_MODULE_13__["default"],
  PollShowcaseItem: _PollShowcaseItem__WEBPACK_IMPORTED_MODULE_14__["default"],
  AbstractPollPage: _AbstractPollPage__WEBPACK_IMPORTED_MODULE_15__.AbstractPollPage
};

/***/ }),

/***/ "./src/forum/extend.ts":
/*!*****************************!*\
  !*** ./src/forum/extend.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extenders */ "flarum/common/extenders");
/* harmony import */ var flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_models_Post__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/models/Post */ "flarum/common/models/Post");
/* harmony import */ var flarum_common_models_Post__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_models_Post__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_models_Forum__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/models/Forum */ "flarum/common/models/Forum");
/* harmony import */ var flarum_common_models_Forum__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_models_Forum__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/models/Discussion */ "flarum/common/models/Discussion");
/* harmony import */ var flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _models_Poll__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models/Poll */ "./src/forum/models/Poll.ts");
/* harmony import */ var _models_PollOption__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./models/PollOption */ "./src/forum/models/PollOption.ts");
/* harmony import */ var _models_PollVote__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./models/PollVote */ "./src/forum/models/PollVote.ts");
/* harmony import */ var _components_PollsPage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/PollsPage */ "./src/forum/components/PollsPage.tsx");
/* harmony import */ var _components_ComposePollPage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/ComposePollPage */ "./src/forum/components/ComposePollPage.tsx");
/* harmony import */ var _components_PollViewPage__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/PollViewPage */ "./src/forum/components/PollViewPage.tsx");
/* harmony import */ var _components_PollsShowcasePage__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/PollsShowcasePage */ "./src/forum/components/PollsShowcasePage.tsx");











/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([new (flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0___default().Routes)() //
.add('fof.polls.showcase', '/polls', _components_PollsShowcasePage__WEBPACK_IMPORTED_MODULE_10__["default"]).add('fof.polls.list', '/polls/all', _components_PollsPage__WEBPACK_IMPORTED_MODULE_7__["default"]).add('fof.polls.view', '/polls/view/:id', _components_PollViewPage__WEBPACK_IMPORTED_MODULE_9__["default"]).add('fof.polls.compose', '/polls/composer', _components_ComposePollPage__WEBPACK_IMPORTED_MODULE_8__["default"]), new (flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0___default().Store)() //
.add('polls', _models_Poll__WEBPACK_IMPORTED_MODULE_4__["default"]).add('poll_options', _models_PollOption__WEBPACK_IMPORTED_MODULE_5__["default"]).add('poll_votes', _models_PollVote__WEBPACK_IMPORTED_MODULE_6__["default"]), new (flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0___default().Model)((flarum_common_models_Post__WEBPACK_IMPORTED_MODULE_1___default())) //
.hasMany('polls').attribute('canStartPoll'), new (flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0___default().Model)((flarum_common_models_Forum__WEBPACK_IMPORTED_MODULE_2___default())) //
.attribute('canStartPolls'), new (flarum_common_extenders__WEBPACK_IMPORTED_MODULE_0___default().Model)((flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_3___default())) //
.attribute('hasPoll').attribute('canStartPoll')]);

/***/ }),

/***/ "./src/forum/index.ts":
/*!****************************!*\
  !*** ./src/forum/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_6__.components),
/* harmony export */   extend: () => (/* reexport safe */ _extend__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   models: () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_7__.models),
/* harmony export */   states: () => (/* reexport safe */ _states__WEBPACK_IMPORTED_MODULE_8__.states)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _addDiscussionBadge__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./addDiscussionBadge */ "./src/forum/addDiscussionBadge.tsx");
/* harmony import */ var _addComposerItems__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./addComposerItems */ "./src/forum/addComposerItems.tsx");
/* harmony import */ var _addPollsToPost__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./addPollsToPost */ "./src/forum/addPollsToPost.tsx");
/* harmony import */ var _addPostControls__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./addPostControls */ "./src/forum/addPostControls.tsx");
/* harmony import */ var _addNavItem__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./addNavItem */ "./src/forum/addNavItem.ts");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components */ "./src/forum/components/index.ts");
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./models */ "./src/forum/models/index.ts");
/* harmony import */ var _states__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./states */ "./src/forum/states/index.ts");
/* harmony import */ var _extend__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./extend */ "./src/forum/extend.ts");









flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('fof/polls', function () {
  (0,_addDiscussionBadge__WEBPACK_IMPORTED_MODULE_1__["default"])();
  (0,_addComposerItems__WEBPACK_IMPORTED_MODULE_2__["default"])();
  (0,_addPollsToPost__WEBPACK_IMPORTED_MODULE_3__["default"])();
  (0,_addPostControls__WEBPACK_IMPORTED_MODULE_4__["default"])();
  (0,_addNavItem__WEBPACK_IMPORTED_MODULE_5__["default"])();
});


/***/ }),

/***/ "./src/forum/models/Poll.ts":
/*!**********************************!*\
  !*** ./src/forum/models/Poll.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Poll)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_utils_computed__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/utils/computed */ "flarum/common/utils/computed");
/* harmony import */ var flarum_common_utils_computed__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_computed__WEBPACK_IMPORTED_MODULE_2__);



var Poll = /*#__PURE__*/function (_Model) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Poll, _Model);
  function Poll() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Model.call.apply(_Model, [this].concat(args)) || this;
    _this.tempOptions = void 0;
    return _this;
  }
  var _proto = Poll.prototype;
  _proto.question = function question() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('question').call(this);
  };
  _proto.subtitle = function subtitle() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('subtitle').call(this);
  };
  _proto.imageUrl = function imageUrl() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('imageUrl').call(this);
  };
  _proto.hasEnded = function hasEnded() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('hasEnded').call(this);
  };
  _proto.endDate = function endDate() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('endDate', (flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().transformDate)).call(this);
  };
  _proto.publicPoll = function publicPoll() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('publicPoll').call(this);
  };
  _proto.hideVotes = function hideVotes() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('hideVotes').call(this);
  };
  _proto.allowChangeVote = function allowChangeVote() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('allowChangeVote').call(this);
  };
  _proto.allowMultipleVotes = function allowMultipleVotes() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('allowMultipleVotes').call(this);
  };
  _proto.maxVotes = function maxVotes() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('maxVotes').call(this);
  };
  _proto.voteCount = function voteCount() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('voteCount').call(this);
  };
  _proto.canVote = function canVote() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('canVote').call(this);
  };
  _proto.canEdit = function canEdit() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('canEdit').call(this);
  };
  _proto.canDelete = function canDelete() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('canDelete').call(this);
  };
  _proto.canSeeVoters = function canSeeVoters() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('canSeeVoters').call(this);
  };
  _proto.canChangeVote = function canChangeVote() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('canChangeVote').call(this);
  };
  _proto.options = function options() {
    var options = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().hasMany('options').call(this);
    return options ? options : [];
  };
  _proto.votes = function votes() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().hasMany('votes').call(this);
  };
  _proto.myVotes = function myVotes() {
    var myVotes = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().hasMany('myVotes').call(this);
    return myVotes ? myVotes : [];
  };
  _proto.isGlobal = function isGlobal() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('isGlobal').call(this);
  };
  _proto.isHidden = function isHidden() {
    return flarum_common_utils_computed__WEBPACK_IMPORTED_MODULE_2___default()('hiddenAt', function (hiddenAt) {
      return !!hiddenAt;
    }).call(this);
  }

  // TODO: These two don't make sense as of now
  ;
  _proto.isUnread = function isUnread() {
    return false;
  };
  _proto.apiEndpoint = function apiEndpoint() {
    /** @ts-ignore */
    return "/fof/polls" + (this.exists ? "/" + this.data.id : '');
  };
  return Poll;
}((flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/models/PollOption.ts":
/*!****************************************!*\
  !*** ./src/forum/models/PollOption.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PollOption)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_1__);


var PollOption = /*#__PURE__*/function (_Model) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PollOption, _Model);
  function PollOption() {
    return _Model.apply(this, arguments) || this;
  }
  var _proto = PollOption.prototype;
  _proto.answer = function answer() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('answer').call(this);
  };
  _proto.imageUrl = function imageUrl() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('imageUrl').call(this);
  };
  _proto.voteCount = function voteCount() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('voteCount').call(this);
  };
  _proto.poll = function poll() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().hasOne('polls').call(this);
  };
  _proto.votes = function votes() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().hasMany('votes').call(this);
  };
  _proto.apiEndpoint = function apiEndpoint() {
    /** @ts-ignore */
    return "/fof/polls/answers" + (this.exists ? "/" + this.data.id : '');
  };
  return PollOption;
}((flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/models/PollVote.ts":
/*!**************************************!*\
  !*** ./src/forum/models/PollVote.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PollVote)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_1__);


var PollVote = /*#__PURE__*/function (_Model) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PollVote, _Model);
  function PollVote() {
    return _Model.apply(this, arguments) || this;
  }
  var _proto = PollVote.prototype;
  _proto.poll = function poll() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().hasOne('poll').call(this);
  };
  _proto.option = function option() {
    var result = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().hasOne('option').call(this);
    return result === false ? null : result;
  };
  _proto.user = function user() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().hasOne('user').call(this);
  };
  _proto.pollId = function pollId() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('pollId').call(this);
  };
  _proto.optionId = function optionId() {
    return flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('optionId').call(this);
  };
  _proto.apiEndpoint = function apiEndpoint() {
    return "/fof/polls/" + this.pollId() + "/vote";
  };
  return PollVote;
}((flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/models/index.ts":
/*!***********************************!*\
  !*** ./src/forum/models/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   models: () => (/* binding */ models)
/* harmony export */ });
/* harmony import */ var _Poll__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Poll */ "./src/forum/models/Poll.ts");
/* harmony import */ var _PollOption__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PollOption */ "./src/forum/models/PollOption.ts");
/* harmony import */ var _PollVote__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PollVote */ "./src/forum/models/PollVote.ts");



var models = {
  Poll: _Poll__WEBPACK_IMPORTED_MODULE_0__["default"],
  PollOption: _PollOption__WEBPACK_IMPORTED_MODULE_1__["default"],
  PollVote: _PollVote__WEBPACK_IMPORTED_MODULE_2__["default"]
};

/***/ }),

/***/ "./src/forum/states/PollFormState.ts":
/*!*******************************************!*\
  !*** ./src/forum/states/PollFormState.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PollFormState)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_2__);



var PollFormState = /*#__PURE__*/function () {
  PollFormState.createNewPoll = function createNewPoll() {
    var poll = flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().store.createRecord('polls');
    poll.pushAttributes({
      question: '',
      endDate: '',
      publicPoll: false,
      allowMultipleVotes: false,
      hideVotes: false,
      allowChangeVote: false,
      maxVotes: 0
    });
    poll.tempOptions = [flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().store.createRecord('poll_options'), flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().store.createRecord('poll_options')];
    return poll;
  };
  function PollFormState(poll) {
    this.poll = void 0;
    this.loading = void 0;
    this.deleting = void 0;
    this.expandedGroup = void 0;
    if (!poll) {
      poll = PollFormState.createNewPoll();
    }
    this.loading = false;
    this.deleting = false;
    this.poll = poll;
    this.expandedGroup = 'setup';
  }
  var _proto = PollFormState.prototype;
  _proto.isExpanded = function isExpanded(groupKey) {
    return this.expandedGroup === groupKey;
  };
  _proto.expand = function expand(groupKey) {
    this.expandedGroup = groupKey;
    m.redraw();
  };
  _proto.save = /*#__PURE__*/function () {
    var _save = (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee(data) {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            this.loading = true;
            m.redraw();
            _context.prev = 2;
            _context.next = 5;
            return this.poll.save(data);
          case 5:
            this.poll = _context.sent;
            /**
             * Cleanup attributes:
             * For the saving process, we add the options directly to the attributes.
             * As we currently cannot add new PollOptions as relationships.
             */
            delete this.poll.data.attributes.options;
          case 7:
            _context.prev = 7;
            this.loading = false;
            m.redraw();
            return _context.finish(7);
          case 11:
          case "end":
            return _context.stop();
        }
      }, _callee, this, [[2,, 7, 11]]);
    }));
    function save(_x) {
      return _save.apply(this, arguments);
    }
    return save;
  }();
  _proto["delete"] = /*#__PURE__*/function () {
    var _delete2 = (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee2() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            this.loading = true;
            m.redraw();
            _context2.prev = 2;
            _context2.next = 5;
            return this.poll["delete"]();
          case 5:
            this.deleting = true;
          case 6:
            _context2.prev = 6;
            this.loading = false;
            m.redraw();
            return _context2.finish(6);
          case 10:
          case "end":
            return _context2.stop();
        }
      }, _callee2, this, [[2,, 6, 10]]);
    }));
    function _delete() {
      return _delete2.apply(this, arguments);
    }
    return _delete;
  }();
  return PollFormState;
}();


/***/ }),

/***/ "./src/forum/states/PollListState.ts":
/*!*******************************************!*\
  !*** ./src/forum/states/PollListState.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PollListState)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_states_PaginatedListState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/states/PaginatedListState */ "flarum/common/states/PaginatedListState");
/* harmony import */ var flarum_common_states_PaginatedListState__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_states_PaginatedListState__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_utils_EventEmitter__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/utils/EventEmitter */ "flarum/common/utils/EventEmitter");
/* harmony import */ var flarum_common_utils_EventEmitter__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_EventEmitter__WEBPACK_IMPORTED_MODULE_5__);



function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }



var globalEventEmitter = new (flarum_common_utils_EventEmitter__WEBPACK_IMPORTED_MODULE_5___default())();
var PollListState = /*#__PURE__*/function (_PaginatedListState) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_2__["default"])(PollListState, _PaginatedListState);
  function PollListState(params, page) {
    var _this;
    if (page === void 0) {
      page = 1;
    }
    _this = _PaginatedListState.call(this, params, page, 20) || this;
    _this.extraPolls = [];
    _this.eventEmitter = void 0;
    _this.eventEmitter = globalEventEmitter.on('poll.deleted', _this.deletePoll.bind((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_1__["default"])(_this)));
    return _this;
  }
  var _proto = PollListState.prototype;
  _proto.requestParams = function requestParams() {
    var _this$params$sort;
    var params = {
      include: this.params.include || ['options', 'votes'],
      filter: this.params.filter || {},
      sort: this.sortMap()[(_this$params$sort = this.params.sort) != null ? _this$params$sort : '']
    };
    if (this.params.q) {
      params.filter.q = this.params.q;
    }
    return params;
  };
  _proto.loadPage = function loadPage(page) {
    if (page === void 0) {
      page = 1;
    }
    var preloadedPolls = flarum_forum_app__WEBPACK_IMPORTED_MODULE_3___default().preloadedApiDocument();
    if (preloadedPolls) {
      this.initialLoading = false;
      return Promise.resolve(preloadedPolls);
    }
    return _PaginatedListState.prototype.loadPage.call(this, page);
  };
  _proto.clear = function clear() {
    _PaginatedListState.prototype.clear.call(this);
    this.extraPolls = [];
  }

  /**
   * Get a map of sort keys (which appear in the URL, and are used for
   * translation) to the API sort value that they represent.
   */;
  _proto.sortMap = function sortMap() {
    var map = {};
    if (this.params.q) {
      map.relevance = '';
    }
    map.newest = '-createdAt';
    map.oldest = 'createdAt';
    return map;
  }

  /**
   * In the last request, has the user searched for a poll?
   */;
  _proto.isSearchResults = function isSearchResults() {
    return !!this.params.q;
  };
  _proto.removePoll = function removePoll(poll) {
    this.eventEmitter.emit('poll.deleted', poll);
  };
  _proto.deletePoll = function deletePoll(poll) {
    for (var _iterator = _createForOfIteratorHelperLoose(this.pages), _step; !(_step = _iterator()).done;) {
      var page = _step.value;
      var _index = page.items.indexOf(poll);
      if (_index !== -1) {
        page.items.splice(_index, 1);
        break;
      }
    }
    var index = this.extraPolls.indexOf(poll);
    if (index !== -1) {
      this.extraPolls.splice(index);
    }
    m.redraw();
  }

  /**
   * Add a poll to the top of the list.
   */;
  _proto.addPoll = function addPoll(poll) {
    this.removePoll(poll);
    this.extraPolls.unshift(poll);
    m.redraw();
  };
  _proto.getAllItems = function getAllItems() {
    return this.extraPolls.concat(_PaginatedListState.prototype.getAllItems.call(this));
  };
  _proto.getPages = function getPages() {
    var pages = _PaginatedListState.prototype.getPages.call(this);
    if (this.extraPolls.length) {
      return [{
        number: -1,
        items: this.extraPolls
      }].concat(pages);
    }
    return pages;
  };
  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_0__["default"])(PollListState, [{
    key: "type",
    get: function get() {
      return 'fof/polls';
    }
  }]);
  return PollListState;
}((flarum_common_states_PaginatedListState__WEBPACK_IMPORTED_MODULE_4___default()));


/***/ }),

/***/ "./src/forum/states/PollState.ts":
/*!***************************************!*\
  !*** ./src/forum/states/PollState.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PollState)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/components/LogInModal */ "flarum/forum/components/LogInModal");
/* harmony import */ var flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_ListVotersModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/ListVotersModal */ "./src/forum/components/ListVotersModal.tsx");



var PollState = /*#__PURE__*/function () {
  function PollState(poll) {
    var _this = this;
    this.poll = void 0;
    this.pendingSubmit = false;
    this.pendingOptions = null;
    this.loadingOptions = false;
    this.useSubmitUI = void 0;
    this.showCheckMarks = void 0;
    this.canSeeVoteCount = void 0;
    this.showVoters = function () {
      // Load all the votes only when opening the votes list
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().modal.show(_components_ListVotersModal__WEBPACK_IMPORTED_MODULE_2__["default"], {
        poll: _this.poll
      });
    };
    this.poll = poll;
    this.useSubmitUI = !(poll != null && poll.canChangeVote()) && (poll == null ? void 0 : poll.allowMultipleVotes());
    this.showCheckMarks = !(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session).user || !poll.hasEnded() && poll.canVote() && (!this.hasVoted() || poll.canChangeVote());
    this.canSeeVoteCount = typeof poll.voteCount() === 'number';
    this.init();
  }

  /**
   * used as en extendable entry point for init customizations
   */
  var _proto = PollState.prototype;
  _proto.init = function init() {};
  _proto.isShowResult = function isShowResult() {
    return this.poll.hasEnded() || this.canSeeVoteCount && this.hasVoted();
  };
  _proto.hasVoted = function hasVoted() {
    return this.poll.myVotes().length > 0;
  };
  _proto.overallVoteCount = function overallVoteCount() {
    return this.poll.voteCount();
  };
  _proto.hasVotedFor = function hasVotedFor(option) {
    return this.pendingOptions ? this.pendingOptions.has(option.id()) : this.poll.myVotes().some(function (vote) {
      return vote.option() === option;
    });
  };
  _proto.getMaxVotes = function getMaxVotes() {
    var poll = this.poll;
    var maxVotes = poll.allowMultipleVotes() ? poll.maxVotes() : 1;
    if (maxVotes === 0) maxVotes = poll.options().length;
    return maxVotes;
  };
  _proto.showButton = function showButton() {
    return this.useSubmitUI && this.pendingSubmit;
  };
  _proto.changeVote = function changeVote(option, evt) {
    var target = evt.target;
    if (!(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().session).user) {
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().modal.show((flarum_forum_components_LogInModal__WEBPACK_IMPORTED_MODULE_1___default()));
      target.checked = false;
      return;
    }
    var optionIds = this.pendingOptions || new Set(this.poll.myVotes().map(function (v) {
      return v.option().id();
    }));
    var isUnvoting = optionIds["delete"](option.id());
    var allowsMultiple = this.poll.allowMultipleVotes();
    if (!allowsMultiple) {
      optionIds.clear();
    }
    if (!isUnvoting) {
      optionIds.add(option.id());
    }
    this.pendingOptions = optionIds.size ? optionIds : null;
    this.pendingSubmit = !!this.pendingOptions;
    if (this.useSubmitUI) {
      this.pendingOptions = optionIds.size ? optionIds : null;
      this.pendingSubmit = !!this.pendingOptions;
      m.redraw();
      return;
    }
    this.submit(optionIds, null, function () {
      return target.checked = isUnvoting;
    });
  };
  _proto.hasSelectedOptions = function hasSelectedOptions() {
    return this.pendingSubmit;
  };
  _proto.onsubmit = function onsubmit() {
    var _this2 = this;
    return this.submit(this.pendingOptions, function () {
      _this2.pendingOptions = null;
      _this2.pendingSubmit = false;
    });
  };
  _proto.submit = function submit(optionIds, cb, onerror) {
    var _this3 = this;
    if (onerror === void 0) {
      onerror = null;
    }
    this.loadingOptions = true;
    m.redraw();
    return flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().request({
      method: 'PATCH',
      url: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().forum.attribute('apiUrl') + "/fof/polls/" + this.poll.id() + "/votes",
      body: {
        data: {
          optionIds: Array.from(optionIds)
        }
      }
    }).then(function (res) {
      flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().store.pushPayload(res);
      cb == null || cb();
    })["catch"](function (err) {
      onerror == null || onerror(err);
    })["finally"](function () {
      _this3.loadingOptions = false;
      _this3.canSeeVoteCount = typeof _this3.poll.voteCount() === 'number';
      m.redraw();
    });
  };
  return PollState;
}();


/***/ }),

/***/ "./src/forum/states/index.ts":
/*!***********************************!*\
  !*** ./src/forum/states/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   states: () => (/* binding */ states)
/* harmony export */ });
/* harmony import */ var _PollFormState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PollFormState */ "./src/forum/states/PollFormState.ts");
/* harmony import */ var _PollListState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PollListState */ "./src/forum/states/PollListState.ts");
/* harmony import */ var _PollState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PollState */ "./src/forum/states/PollState.ts");



var states = {
  PollFormState: _PollFormState__WEBPACK_IMPORTED_MODULE_0__["default"],
  PollListState: _PollListState__WEBPACK_IMPORTED_MODULE_1__["default"],
  PollState: _PollState__WEBPACK_IMPORTED_MODULE_2__["default"]
};

/***/ }),

/***/ "./src/forum/utils/PollControls.tsx":
/*!******************************************!*\
  !*** ./src/forum/utils/PollControls.tsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_ComposePollPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/ComposePollPage */ "./src/forum/components/ComposePollPage.tsx");
/* harmony import */ var _components_PollsPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/PollsPage */ "./src/forum/components/PollsPage.tsx");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_components_Separator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/components/Separator */ "flarum/common/components/Separator");
/* harmony import */ var flarum_common_components_Separator__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Separator__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7__);









/**
 * The `UserControls` utility constructs a list of buttons for a user which
 * perform actions on it.
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  /**
   * Get a list of controls for a user.
   */
  controls: function controls(poll, context) {
    var _this = this;
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_5___default())();
    ['poll', 'moderation', 'destructive'].forEach(function (section) {
      var controls = _this[section + 'Controls'](poll, context).toArray();
      if (controls.length) {
        controls.forEach(function (item) {
          return items.add(item.itemName, item);
        });
        items.add(section + 'Separator', m((flarum_common_components_Separator__WEBPACK_IMPORTED_MODULE_6___default()), null));
      }
    });
    return items;
  },
  /**
   * Get controls for direct modifcation actions on polls (e.g. vote, view voters).
   */
  pollControls: function pollControls(poll, context) {
    return new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_5___default())();
  },
  /**
   * Get controls for a user pertaining to moderation (e.g. suspend, edit).
   */
  moderationControls: function moderationControls(poll, context) {
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_5___default())();
    if (poll.canEdit()) {
      items.add('edit', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7___default()), {
        icon: "fas fa-pencil-alt",
        onclick: this.editAction.bind(this, poll)
      }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans("fof-polls.forum.poll_controls.edit_label")));
    }
    return items;
  },
  /**
   * Get controls for a user which are destructive (e.g. delete).
   * @protected
   */
  destructiveControls: function destructiveControls(poll, context) {
    var items = new (flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_5___default())();
    if (poll.canDelete()) {
      items.add('delete', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7___default()), {
        icon: "far fa-trash-alt",
        onclick: this.deleteAction.bind(this, poll)
      }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans("fof-polls.forum.poll_controls.delete_label")));
    }
    return items;
  },
  /**
   * Delete the user.
   */
  deleteAction: function deleteAction(poll) {
    var _this2 = this;
    return (0,_babel_runtime_helpers_esm_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().mark(function _callee() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_1___default().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (confirm(flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans("fof-polls.forum.poll_controls.delete_confirmation"))) {
              _context.next = 2;
              break;
            }
            return _context.abrupt("return");
          case 2:
            return _context.abrupt("return", poll["delete"]().then(function () {
              _this2.showDeletionAlert(poll, 'success');
              if (flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().current.matches(_components_ComposePollPage__WEBPACK_IMPORTED_MODULE_3__["default"], {
                id: poll.id()
              }) || flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().current.matches(_components_PollsPage__WEBPACK_IMPORTED_MODULE_4__["default"], {
                id: poll.id()
              })) {
                flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().history.back();
              } else {
                window.location.reload();
              }
            })["catch"](function () {
              return _this2.showDeletionAlert(poll, 'error');
            }));
          case 3:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  },
  /**
   * Show deletion alert of poll
   */
  showDeletionAlert: function showDeletionAlert(poll, type) {
    var message = {
      success: "fof-polls.forum.poll_controls.delete_success_message",
      error: "fof-polls.forum.poll_controls.delete_error_message"
    }[type];
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().alerts.show({
      type: type
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().translator.trans(message, {
      poll: poll
    }));
  },
  /**
   * Edit the poll.
   */
  editAction: function editAction(poll) {
    m.route.set(flarum_forum_app__WEBPACK_IMPORTED_MODULE_2___default().route('fof.polls.compose', {
      id: poll.id()
    }));
  }
});

/***/ }),

/***/ "flarum/common/Component":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['common/Component']" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Component'];

/***/ }),

/***/ "flarum/common/Model":
/*!*****************************************************!*\
  !*** external "flarum.core.compat['common/Model']" ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Model'];

/***/ }),

/***/ "flarum/common/components/Badge":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Badge']" ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Badge'];

/***/ }),

/***/ "flarum/common/components/Button":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Button']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Button'];

/***/ }),

/***/ "flarum/common/components/Dropdown":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['common/components/Dropdown']" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Dropdown'];

/***/ }),

/***/ "flarum/common/components/Link":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['common/components/Link']" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Link'];

/***/ }),

/***/ "flarum/common/components/LinkButton":
/*!*********************************************************************!*\
  !*** external "flarum.core.compat['common/components/LinkButton']" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/LinkButton'];

/***/ }),

/***/ "flarum/common/components/LoadingIndicator":
/*!***************************************************************************!*\
  !*** external "flarum.core.compat['common/components/LoadingIndicator']" ***!
  \***************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/LoadingIndicator'];

/***/ }),

/***/ "flarum/common/components/Modal":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Modal']" ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Modal'];

/***/ }),

/***/ "flarum/common/components/Page":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['common/components/Page']" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Page'];

/***/ }),

/***/ "flarum/common/components/Placeholder":
/*!**********************************************************************!*\
  !*** external "flarum.core.compat['common/components/Placeholder']" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Placeholder'];

/***/ }),

/***/ "flarum/common/components/SelectDropdown":
/*!*************************************************************************!*\
  !*** external "flarum.core.compat['common/components/SelectDropdown']" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/SelectDropdown'];

/***/ }),

/***/ "flarum/common/components/Separator":
/*!********************************************************************!*\
  !*** external "flarum.core.compat['common/components/Separator']" ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Separator'];

/***/ }),

/***/ "flarum/common/components/Switch":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Switch']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Switch'];

/***/ }),

/***/ "flarum/common/components/Tooltip":
/*!******************************************************************!*\
  !*** external "flarum.core.compat['common/components/Tooltip']" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Tooltip'];

/***/ }),

/***/ "flarum/common/extend":
/*!******************************************************!*\
  !*** external "flarum.core.compat['common/extend']" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/extend'];

/***/ }),

/***/ "flarum/common/extenders":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['common/extenders']" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/extenders'];

/***/ }),

/***/ "flarum/common/helpers/avatar":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/avatar']" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/helpers/avatar'];

/***/ }),

/***/ "flarum/common/helpers/highlight":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/highlight']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/helpers/highlight'];

/***/ }),

/***/ "flarum/common/helpers/icon":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/icon']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/helpers/icon'];

/***/ }),

/***/ "flarum/common/helpers/listItems":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/listItems']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/helpers/listItems'];

/***/ }),

/***/ "flarum/common/helpers/username":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/username']" ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/helpers/username'];

/***/ }),

/***/ "flarum/common/models/Discussion":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/models/Discussion']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/models/Discussion'];

/***/ }),

/***/ "flarum/common/models/Forum":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/models/Forum']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/models/Forum'];

/***/ }),

/***/ "flarum/common/models/Post":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['common/models/Post']" ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/models/Post'];

/***/ }),

/***/ "flarum/common/states/PaginatedListState":
/*!*************************************************************************!*\
  !*** external "flarum.core.compat['common/states/PaginatedListState']" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/states/PaginatedListState'];

/***/ }),

/***/ "flarum/common/utils/EventEmitter":
/*!******************************************************************!*\
  !*** external "flarum.core.compat['common/utils/EventEmitter']" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/EventEmitter'];

/***/ }),

/***/ "flarum/common/utils/ItemList":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['common/utils/ItemList']" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/ItemList'];

/***/ }),

/***/ "flarum/common/utils/Stream":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/utils/Stream']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/Stream'];

/***/ }),

/***/ "flarum/common/utils/SubtreeRetainer":
/*!*********************************************************************!*\
  !*** external "flarum.core.compat['common/utils/SubtreeRetainer']" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/SubtreeRetainer'];

/***/ }),

/***/ "flarum/common/utils/abbreviateNumber":
/*!**********************************************************************!*\
  !*** external "flarum.core.compat['common/utils/abbreviateNumber']" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/abbreviateNumber'];

/***/ }),

/***/ "flarum/common/utils/classList":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['common/utils/classList']" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/classList'];

/***/ }),

/***/ "flarum/common/utils/computed":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['common/utils/computed']" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/computed'];

/***/ }),

/***/ "flarum/common/utils/extractText":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/utils/extractText']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/extractText'];

/***/ }),

/***/ "flarum/common/utils/string":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/utils/string']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/string'];

/***/ }),

/***/ "flarum/forum/app":
/*!**************************************************!*\
  !*** external "flarum.core.compat['forum/app']" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/app'];

/***/ }),

/***/ "flarum/forum/components/CommentPost":
/*!*********************************************************************!*\
  !*** external "flarum.core.compat['forum/components/CommentPost']" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/CommentPost'];

/***/ }),

/***/ "flarum/forum/components/DiscussionComposer":
/*!****************************************************************************!*\
  !*** external "flarum.core.compat['forum/components/DiscussionComposer']" ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/DiscussionComposer'];

/***/ }),

/***/ "flarum/forum/components/DiscussionList":
/*!************************************************************************!*\
  !*** external "flarum.core.compat['forum/components/DiscussionList']" ***!
  \************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/DiscussionList'];

/***/ }),

/***/ "flarum/forum/components/DiscussionPage":
/*!************************************************************************!*\
  !*** external "flarum.core.compat['forum/components/DiscussionPage']" ***!
  \************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/DiscussionPage'];

/***/ }),

/***/ "flarum/forum/components/IndexPage":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['forum/components/IndexPage']" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/IndexPage'];

/***/ }),

/***/ "flarum/forum/components/LogInModal":
/*!********************************************************************!*\
  !*** external "flarum.core.compat['forum/components/LogInModal']" ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/LogInModal'];

/***/ }),

/***/ "flarum/forum/components/ReplyComposer":
/*!***********************************************************************!*\
  !*** external "flarum.core.compat['forum/components/ReplyComposer']" ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/ReplyComposer'];

/***/ }),

/***/ "flarum/forum/utils/PostControls":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['forum/utils/PostControls']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/utils/PostControls'];

/***/ }),

/***/ "flarum/forum/utils/slidable":
/*!*************************************************************!*\
  !*** external "flarum.core.compat['forum/utils/slidable']" ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/utils/slidable'];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/regeneratorRuntime.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/regeneratorRuntime.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/typeof.js")["default"]);
function _regeneratorRuntime() {
  "use strict";

  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return e;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function define(t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function value(t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw new Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(_typeof(e) + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function stop() {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw new Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function complete(t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function finish(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    "catch": function _catch(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/***/ ((module) => {

function _typeof(o) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(/*! ../helpers/regeneratorRuntime */ "./node_modules/@babel/runtime/helpers/regeneratorRuntime.js")();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _assertThisInitialized)
/* harmony export */ });
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _asyncToGenerator)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/construct.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/construct.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _construct)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");
/* harmony import */ var _isNativeReflectConstruct_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isNativeReflectConstruct.js */ "./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js");


function _construct(t, e, r) {
  if ((0,_isNativeReflectConstruct_js__WEBPACK_IMPORTED_MODULE_1__["default"])()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(p, r.prototype), p;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createClass)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _getPrototypeOf)
/* harmony export */ });
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inheritsLoose)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/isNativeFunction.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/isNativeFunction.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _isNativeFunction)
/* harmony export */ });
function _isNativeFunction(fn) {
  try {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  } catch (e) {
    return typeof fn === "function";
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _isNativeReflectConstruct)
/* harmony export */ });
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  })();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPrimitive)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");

function toPrimitive(t, r) {
  if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toPropertyKey)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toPrimitive.js */ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js");


function toPropertyKey(t) {
  var i = (0,_toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__["default"])(t, "string");
  return "symbol" == (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(i) ? i : String(i);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _wrapNativeSuper)
/* harmony export */ });
/* harmony import */ var _getPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");
/* harmony import */ var _isNativeFunction_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isNativeFunction.js */ "./node_modules/@babel/runtime/helpers/esm/isNativeFunction.js");
/* harmony import */ var _construct_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./construct.js */ "./node_modules/@babel/runtime/helpers/esm/construct.js");




function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;
  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !(0,_isNativeFunction_js__WEBPACK_IMPORTED_MODULE_2__["default"])(Class)) return Class;
    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }
    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);
      _cache.set(Class, Wrapper);
    }
    function Wrapper() {
      return (0,_construct_js__WEBPACK_IMPORTED_MODULE_3__["default"])(Class, arguments, (0,_getPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this).constructor);
    }
    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Wrapper, Class);
  };
  return _wrapNativeSuper(Class);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./forum.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: () => (/* reexport safe */ _src_forum__WEBPACK_IMPORTED_MODULE_0__.components),
/* harmony export */   extend: () => (/* reexport safe */ _src_forum__WEBPACK_IMPORTED_MODULE_0__.extend),
/* harmony export */   models: () => (/* reexport safe */ _src_forum__WEBPACK_IMPORTED_MODULE_0__.models),
/* harmony export */   states: () => (/* reexport safe */ _src_forum__WEBPACK_IMPORTED_MODULE_0__.states)
/* harmony export */ });
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.ts");

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=forum.js.map