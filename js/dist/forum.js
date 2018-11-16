module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./forum.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./forum.js":
/*!******************!*\
  !*** ./forum.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/common */ "./src/common/index.js");
/* harmony import */ var _src_common__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_src_common__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _src_common__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _src_common__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.js");
/* empty/unused harmony star reexport *//*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */



/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _inheritsLoose; });
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

/***/ }),

/***/ "./node_modules/DateTimePicker/dist/DateTimePicker.min.js":
/*!****************************************************************!*\
  !*** ./node_modules/DateTimePicker/dist/DateTimePicker.min.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* ----------------------------------------------------------------------------- 

  jQuery DateTimePicker - Responsive flat design jQuery DateTime Picker plugin for Web & Mobile
  Version 0.1.38
  Copyright (c)2017 Lajpat Shah
  Contributors : https://github.com/nehakadam/DateTimePicker/contributors
  Repository : https://github.com/nehakadam/DateTimePicker
  Documentation : https://nehakadam.github.io/DateTimePicker

 ----------------------------------------------------------------------------- */

Object.keys||(Object.keys=function(a){var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(c);return b}),$.DateTimePicker=$.DateTimePicker||{name:"DateTimePicker",i18n:{},defaults:{mode:"date",defaultDate:null,dateSeparator:"-",timeSeparator:":",timeMeridiemSeparator:" ",dateTimeSeparator:" ",monthYearSeparator:" ",dateTimeFormat:"dd-MM-yyyy HH:mm",dateFormat:"dd-MM-yyyy",timeFormat:"HH:mm",maxDate:null,minDate:null,maxTime:null,minTime:null,maxDateTime:null,minDateTime:null,shortDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],fullDayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],fullMonthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],labels:null,minuteInterval:1,roundOffMinutes:!0,secondsInterval:1,roundOffSeconds:!0,showHeader:!0,titleContentDate:"Set Date",titleContentTime:"Set Time",titleContentDateTime:"Set Date & Time",buttonsToDisplay:["HeaderCloseButton","SetButton","ClearButton"],setButtonContent:"Set",clearButtonContent:"Clear",incrementButtonContent:"+",decrementButtonContent:"-",setValueInTextboxOnEveryClick:!1,readonlyInputs:!1,animationDuration:400,touchHoldInterval:300,captureTouchHold:!1,mouseHoldInterval:50,captureMouseHold:!1,isPopup:!0,parentElement:"body",isInline:!1,inputElement:null,language:"",init:null,addEventHandlers:null,beforeShow:null,afterShow:null,beforeHide:null,afterHide:null,buttonClicked:null,settingValueOfElement:null,formatHumanDate:null,parseDateTimeString:null,formatDateTimeString:null},dataObject:{dCurrentDate:new Date,iCurrentDay:0,iCurrentMonth:0,iCurrentYear:0,iCurrentHour:0,iCurrentMinutes:0,iCurrentSeconds:0,sCurrentMeridiem:"",iMaxNumberOfDays:0,sDateFormat:"",sTimeFormat:"",sDateTimeFormat:"",dMinValue:null,dMaxValue:null,sArrInputDateFormats:[],sArrInputTimeFormats:[],sArrInputDateTimeFormats:[],bArrMatchFormat:[],bDateMode:!1,bTimeMode:!1,bDateTimeMode:!1,oInputElement:null,iTabIndex:0,bElemFocused:!1,bIs12Hour:!1,sTouchButton:null,iTouchStart:null,oTimeInterval:null,bIsTouchDevice:"ontouchstart"in document.documentElement}},$.cf={_isValid:function(a){return void 0!==a&&null!==a&&""!==a},_compare:function(a,b){var c=void 0!==a&&null!==a,d=void 0!==b&&null!==b;return!(!c||!d)&&a.toLowerCase()===b.toLowerCase()}},function(a){ true?!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "jquery")], __WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):undefined}(function(a){"use strict";function b(b,c){this.element=b;var d="";d=a.cf._isValid(c)&&a.cf._isValid(c.language)?c.language:a.DateTimePicker.defaults.language,this.settings=a.extend({},a.DateTimePicker.defaults,a.DateTimePicker.i18n[d],c),this.options=c,this.oData=a.extend({},a.DateTimePicker.dataObject),this._defaults=a.DateTimePicker.defaults,this._name=a.DateTimePicker.name,this.init()}a.fn.DateTimePicker=function(c){var d,e,f=a(this).data(),g=f?Object.keys(f):[];if("string"!=typeof c)return this.each(function(){a.removeData(this,"plugin_DateTimePicker"),a.data(this,"plugin_DateTimePicker")||a.data(this,"plugin_DateTimePicker",new b(this,c))});if(a.cf._isValid(f))if("destroy"===c){if(g.length>0)for(d in g)if(e=g[d],e.search("plugin_DateTimePicker")!==-1){a(document).unbind("click.DateTimePicker keydown.DateTimePicker keyup.DateTimePicker"),a(this).children().remove(),a(this).removeData(),a(this).unbind(),a(this).removeClass("dtpicker-overlay dtpicker-mobile dtpicker-inline"),f=f[e];break}}else if("object"===c&&g.length>0)for(d in g)if(e=g[d],e.search("plugin_DateTimePicker")!==-1)return f[e]},b.prototype={init:function(){var b=this;b._setDateFormatArray(),b._setTimeFormatArray(),b._setDateTimeFormatArray(),void 0!==a(b.element).data("parentelement")&&(b.settings.parentElement=a(b.element).data("parentelement")),b.settings.isPopup&&!b.settings.isInline&&(b._createPicker(),a(b.element).addClass("dtpicker-mobile")),b.settings.isInline&&(b._createPicker(),b._showPicker(b.settings.inputElement)),b.settings.init&&b.settings.init.call(b),b._addEventHandlersForInput()},_setDateFormatArray:function(){var a=this;a.oData.sArrInputDateFormats=[];var b="";b="dd"+a.settings.dateSeparator+"MM"+a.settings.dateSeparator+"yyyy",a.oData.sArrInputDateFormats.push(b),b="MM"+a.settings.dateSeparator+"dd"+a.settings.dateSeparator+"yyyy",a.oData.sArrInputDateFormats.push(b),b="yyyy"+a.settings.dateSeparator+"MM"+a.settings.dateSeparator+"dd",a.oData.sArrInputDateFormats.push(b),b="dd"+a.settings.dateSeparator+"MMM"+a.settings.dateSeparator+"yyyy",a.oData.sArrInputDateFormats.push(b),b="MM"+a.settings.monthYearSeparator+"yyyy",a.oData.sArrInputDateFormats.push(b),b="MMM"+a.settings.monthYearSeparator+"yyyy",a.oData.sArrInputDateFormats.push(b),b="MMMM"+a.settings.monthYearSeparator+"yyyy",a.oData.sArrInputDateFormats.push(b),b="yyyy"+a.settings.monthYearSeparator+"MM",a.oData.sArrInputDateFormats.push(b)},_setTimeFormatArray:function(){var a=this;a.oData.sArrInputTimeFormats=[];var b="";b="hh"+a.settings.timeSeparator+"mm"+a.settings.timeSeparator+"ss"+a.settings.timeMeridiemSeparator+"AA",a.oData.sArrInputTimeFormats.push(b),b="HH"+a.settings.timeSeparator+"mm"+a.settings.timeSeparator+"ss",a.oData.sArrInputTimeFormats.push(b),b="hh"+a.settings.timeSeparator+"mm"+a.settings.timeMeridiemSeparator+"AA",a.oData.sArrInputTimeFormats.push(b),b="HH"+a.settings.timeSeparator+"mm",a.oData.sArrInputTimeFormats.push(b)},_setDateTimeFormatArray:function(){var a=this;a.oData.sArrInputDateTimeFormats=[];var b="",c="",d="";b="dd"+a.settings.dateSeparator+"MM"+a.settings.dateSeparator+"yyyy",c="HH"+a.settings.timeSeparator+"mm"+a.settings.timeSeparator+"ss",d=b+a.settings.dateTimeSeparator+c,a.oData.sArrInputDateTimeFormats.push(d),b="dd"+a.settings.dateSeparator+"MM"+a.settings.dateSeparator+"yyyy",c="hh"+a.settings.timeSeparator+"mm"+a.settings.timeSeparator+"ss"+a.settings.timeMeridiemSeparator+"AA",d=b+a.settings.dateTimeSeparator+c,a.oData.sArrInputDateTimeFormats.push(d),b="MM"+a.settings.dateSeparator+"dd"+a.settings.dateSeparator+"yyyy",c="HH"+a.settings.timeSeparator+"mm"+a.settings.timeSeparator+"ss",d=b+a.settings.dateTimeSeparator+c,a.oData.sArrInputDateTimeFormats.push(d),b="MM"+a.settings.dateSeparator+"dd"+a.settings.dateSeparator+"yyyy",c="hh"+a.settings.timeSeparator+"mm"+a.settings.timeSeparator+"ss"+a.settings.timeMeridiemSeparator+"AA",d=b+a.settings.dateTimeSeparator+c,a.oData.sArrInputDateTimeFormats.push(d),b="yyyy"+a.settings.dateSeparator+"MM"+a.settings.dateSeparator+"dd",c="HH"+a.settings.timeSeparator+"mm"+a.settings.timeSeparator+"ss",d=b+a.settings.dateTimeSeparator+c,a.oData.sArrInputDateTimeFormats.push(d),b="yyyy"+a.settings.dateSeparator+"MM"+a.settings.dateSeparator+"dd",c="hh"+a.settings.timeSeparator+"mm"+a.settings.timeSeparator+"ss"+a.settings.timeMeridiemSeparator+"AA",d=b+a.settings.dateTimeSeparator+c,a.oData.sArrInputDateTimeFormats.push(d),b="dd"+a.settings.dateSeparator+"MMM"+a.settings.dateSeparator+"yyyy",c="hh"+a.settings.timeSeparator+"mm"+a.settings.timeSeparator+"ss",d=b+a.settings.dateTimeSeparator+c,a.oData.sArrInputDateTimeFormats.push(d),b="dd"+a.settings.dateSeparator+"MMM"+a.settings.dateSeparator+"yyyy",c="hh"+a.settings.timeSeparator+"mm"+a.settings.timeSeparator+"ss"+a.settings.timeMeridiemSeparator+"AA",d=b+a.settings.dateTimeSeparator+c,a.oData.sArrInputDateTimeFormats.push(d),b="dd"+a.settings.dateSeparator+"MM"+a.settings.dateSeparator+"yyyy",c="HH"+a.settings.timeSeparator+"mm",d=b+a.settings.dateTimeSeparator+c,a.oData.sArrInputDateTimeFormats.push(d),b="dd"+a.settings.dateSeparator+"MM"+a.settings.dateSeparator+"yyyy",c="hh"+a.settings.timeSeparator+"mm"+a.settings.timeMeridiemSeparator+"AA",d=b+a.settings.dateTimeSeparator+c,a.oData.sArrInputDateTimeFormats.push(d),b="MM"+a.settings.dateSeparator+"dd"+a.settings.dateSeparator+"yyyy",c="HH"+a.settings.timeSeparator+"mm",d=b+a.settings.dateTimeSeparator+c,a.oData.sArrInputDateTimeFormats.push(d),b="MM"+a.settings.dateSeparator+"dd"+a.settings.dateSeparator+"yyyy",c="hh"+a.settings.timeSeparator+"mm"+a.settings.timeMeridiemSeparator+"AA",d=b+a.settings.dateTimeSeparator+c,a.oData.sArrInputDateTimeFormats.push(d),b="yyyy"+a.settings.dateSeparator+"MM"+a.settings.dateSeparator+"dd",c="HH"+a.settings.timeSeparator+"mm",d=b+a.settings.dateTimeSeparator+c,a.oData.sArrInputDateTimeFormats.push(d),b="yyyy"+a.settings.dateSeparator+"MM"+a.settings.dateSeparator+"dd",c="hh"+a.settings.timeSeparator+"mm"+a.settings.timeMeridiemSeparator+"AA",d=b+a.settings.dateTimeSeparator+c,a.oData.sArrInputDateTimeFormats.push(d),b="dd"+a.settings.dateSeparator+"MMM"+a.settings.dateSeparator+"yyyy",c="hh"+a.settings.timeSeparator+"mm",d=b+a.settings.dateTimeSeparator+c,a.oData.sArrInputDateTimeFormats.push(d),b="dd"+a.settings.dateSeparator+"MMM"+a.settings.dateSeparator+"yyyy",c="hh"+a.settings.timeSeparator+"mm"+a.settings.timeMeridiemSeparator+"AA",d=b+a.settings.dateTimeSeparator+c,a.oData.sArrInputDateTimeFormats.push(d)},_matchFormat:function(b,c){var d=this;d.oData.bArrMatchFormat=[],d.oData.bDateMode=!1,d.oData.bTimeMode=!1,d.oData.bDateTimeMode=!1;var e,f=[];for(b=a.cf._isValid(b)?b:d.settings.mode,a.cf._compare(b,"date")?(c=a.cf._isValid(c)?c:d.oData.sDateFormat,d.oData.bDateMode=!0,f=d.oData.sArrInputDateFormats):a.cf._compare(b,"time")?(c=a.cf._isValid(c)?c:d.oData.sTimeFormat,d.oData.bTimeMode=!0,f=d.oData.sArrInputTimeFormats):a.cf._compare(b,"datetime")&&(c=a.cf._isValid(c)?c:d.oData.sDateTimeFormat,d.oData.bDateTimeMode=!0,f=d.oData.sArrInputDateTimeFormats),e=0;e<f.length;e++)d.oData.bArrMatchFormat.push(a.cf._compare(c,f[e]))},_setMatchFormat:function(a,b,c){var d=this;a>0&&d._matchFormat(b,c)},_createPicker:function(){var b=this;b.settings.isInline?a(b.element).addClass("dtpicker-inline"):(a(b.element).addClass("dtpicker-overlay"),a(".dtpicker-overlay").click(function(a){b._hidePicker("")}));var c="";c+="<div class='dtpicker-bg'>",c+="<div class='dtpicker-cont'>",c+="<div class='dtpicker-content'>",c+="<div class='dtpicker-subcontent'>",c+="</div>",c+="</div>",c+="</div>",c+="</div>",a(b.element).html(c)},_addEventHandlersForInput:function(){var b=this;if(!b.settings.isInline){b.oData.oInputElement=null,a(b.settings.parentElement).find("input[type='date'], input[type='time'], input[type='datetime']").each(function(){a(this).attr("data-field",a(this).attr("type")),a(this).attr("type","text")});var c="[data-field='date'], [data-field='time'], [data-field='datetime']";a(b.settings.parentElement).off("focus",c,b._inputFieldFocus).on("focus",c,{obj:b},b._inputFieldFocus),a(b.settings.parentElement).off("click",c,b._inputFieldClick).on("click",c,{obj:b},b._inputFieldClick)}b.settings.addEventHandlers&&b.settings.addEventHandlers.call(b)},_inputFieldFocus:function(a){var b=a.data.obj;b.showDateTimePicker(this),b.oData.bMouseDown=!1},_inputFieldClick:function(b){var c=b.data.obj;a.cf._compare(a(this).prop("tagName"),"input")||c.showDateTimePicker(this),b.stopPropagation()},getDateObjectForInputField:function(b){var c=this;if(a.cf._isValid(b)){var d,e=c._getValueOfElement(b),f=a(b).data("field"),g="";return a.cf._isValid(f)||(f=c.settings.mode),c.settings.formatDateTimeString?d=c.settings.parseDateTimeString.call(c,e,f,g,a(b)):(g=a(b).data("format"),a.cf._isValid(g)||(a.cf._compare(f,"date")?g=c.settings.dateFormat:a.cf._compare(f,"time")?g=c.settings.timeFormat:a.cf._compare(f,"datetime")&&(g=c.settings.dateTimeFormat)),c._matchFormat(f,g),a.cf._compare(f,"date")?d=c._parseDate(e):a.cf._compare(f,"time")?d=c._parseTime(e):a.cf._compare(f,"datetime")&&(d=c._parseDateTime(e))),d}},setDateTimeStringInInputField:function(b,c){var d=this;c=c||d.oData.dCurrentDate;var e;a.cf._isValid(b)?(e=[],"string"==typeof b?e.push(b):"object"==typeof b&&(e=b)):e=a.cf._isValid(d.settings.parentElement)?a(d.settings.parentElement).find("[data-field='date'], [data-field='time'], [data-field='datetime']"):a("[data-field='date'], [data-field='time'], [data-field='datetime']"),e.each(function(){var b,e,f,g,h=this;b=a(h).data("field"),a.cf._isValid(b)||(b=d.settings.mode),e="Custom",f=!1,d.settings.formatDateTimeString||(e=a(h).data("format"),a.cf._isValid(e)||(a.cf._compare(b,"date")?e=d.settings.dateFormat:a.cf._compare(b,"time")?e=d.settings.timeFormat:a.cf._compare(b,"datetime")&&(e=d.settings.dateTimeFormat)),f=d.getIs12Hour(b,e)),g=d._setOutput(b,e,f,c,h),d._setValueOfElement(g,a(h))})},getDateTimeStringInFormat:function(a,b,c){var d=this;return d._setOutput(a,b,d.getIs12Hour(a,b),c)},showDateTimePicker:function(a){var b=this;null!==b.oData.oInputElement?b.settings.isInline||b._hidePicker(0,a):b._showPicker(a)},_setButtonAction:function(a){var b=this;null!==b.oData.oInputElement&&(b._setValueOfElement(b._setOutput()),a?(b.settings.buttonClicked&&b.settings.buttonClicked.call(b,"TAB",b.oData.oInputElement),b.settings.isInline||b._hidePicker(0)):b.settings.isInline||b._hidePicker(""))},_setOutput:function(b,c,d,e,f){var g=this;e=a.cf._isValid(e)?e:g.oData.dCurrentDate,d=d||g.oData.bIs12Hour;var h,i=g._setVariablesForDate(e,!0,!0),j="",k=g._formatDate(i),l=g._formatTime(i),m=a.extend({},k,l),n="",o="",p=Function.length;return g.settings.formatDateTimeString?j=g.settings.formatDateTimeString.call(g,m,b,c,f):(g._setMatchFormat(p,b,c),g.oData.bDateMode?g.oData.bArrMatchFormat[0]?j=m.dd+g.settings.dateSeparator+m.MM+g.settings.dateSeparator+m.yyyy:g.oData.bArrMatchFormat[1]?j=m.MM+g.settings.dateSeparator+m.dd+g.settings.dateSeparator+m.yyyy:g.oData.bArrMatchFormat[2]?j=m.yyyy+g.settings.dateSeparator+m.MM+g.settings.dateSeparator+m.dd:g.oData.bArrMatchFormat[3]?j=m.dd+g.settings.dateSeparator+m.monthShort+g.settings.dateSeparator+m.yyyy:g.oData.bArrMatchFormat[4]?j=m.MM+g.settings.monthYearSeparator+m.yyyy:g.oData.bArrMatchFormat[5]?j=m.monthShort+g.settings.monthYearSeparator+m.yyyy:g.oData.bArrMatchFormat[6]?j=m.month+g.settings.monthYearSeparator+m.yyyy:g.oData.bArrMatchFormat[7]&&(j=m.yyyy+g.settings.monthYearSeparator+m.MM):g.oData.bTimeMode?g.oData.bArrMatchFormat[0]?j=m.hh+g.settings.timeSeparator+m.mm+g.settings.timeSeparator+m.ss+g.settings.timeMeridiemSeparator+m.ME:g.oData.bArrMatchFormat[1]?j=m.HH+g.settings.timeSeparator+m.mm+g.settings.timeSeparator+m.ss:g.oData.bArrMatchFormat[2]?j=m.hh+g.settings.timeSeparator+m.mm+g.settings.timeMeridiemSeparator+m.ME:g.oData.bArrMatchFormat[3]&&(j=m.HH+g.settings.timeSeparator+m.mm):g.oData.bDateTimeMode&&(g.oData.bArrMatchFormat[0]||g.oData.bArrMatchFormat[1]||g.oData.bArrMatchFormat[8]||g.oData.bArrMatchFormat[9]?n=m.dd+g.settings.dateSeparator+m.MM+g.settings.dateSeparator+m.yyyy:g.oData.bArrMatchFormat[2]||g.oData.bArrMatchFormat[3]||g.oData.bArrMatchFormat[10]||g.oData.bArrMatchFormat[11]?n=m.MM+g.settings.dateSeparator+m.dd+g.settings.dateSeparator+m.yyyy:g.oData.bArrMatchFormat[4]||g.oData.bArrMatchFormat[5]||g.oData.bArrMatchFormat[12]||g.oData.bArrMatchFormat[13]?n=m.yyyy+g.settings.dateSeparator+m.MM+g.settings.dateSeparator+m.dd:(g.oData.bArrMatchFormat[6]||g.oData.bArrMatchFormat[7]||g.oData.bArrMatchFormat[14]||g.oData.bArrMatchFormat[15])&&(n=m.dd+g.settings.dateSeparator+m.monthShort+g.settings.dateSeparator+m.yyyy),h=g.oData.bArrMatchFormat[0]||g.oData.bArrMatchFormat[1]||g.oData.bArrMatchFormat[2]||g.oData.bArrMatchFormat[3]||g.oData.bArrMatchFormat[4]||g.oData.bArrMatchFormat[5]||g.oData.bArrMatchFormat[6]||g.oData.bArrMatchFormat[7],o=d?h?m.hh+g.settings.timeSeparator+m.mm+g.settings.timeSeparator+m.ss+g.settings.timeMeridiemSeparator+m.ME:m.hh+g.settings.timeSeparator+m.mm+g.settings.timeMeridiemSeparator+m.ME:h?m.HH+g.settings.timeSeparator+m.mm+g.settings.timeSeparator+m.ss:m.HH+g.settings.timeSeparator+m.mm,""!==n&&""!==o&&(j=n+g.settings.dateTimeSeparator+o)),g._setMatchFormat(p)),j},_clearButtonAction:function(){var a=this;null!==a.oData.oInputElement&&a._setValueOfElement(""),a.settings.isInline||a._hidePicker("")},_setOutputOnIncrementOrDecrement:function(){var b=this;a.cf._isValid(b.oData.oInputElement)&&b.settings.setValueInTextboxOnEveryClick&&b._setValueOfElement(b._setOutput())},_showPicker:function(b){var c=this;if(null===c.oData.oInputElement){c.oData.oInputElement=b,c.oData.iTabIndex=parseInt(a(b).attr("tabIndex"));var d=a(b).data("field")||"",e=a(b).data("min")||"",f=a(b).data("max")||"",g=a(b).data("format")||"",h=a(b).data("view")||"",i=a(b).data("startend")||"",j=a(b).data("startendelem")||"",k=c._getValueOfElement(b)||"";if(""!==h&&(a.cf._compare(h,"Popup")?c.setIsPopup(!0):c.setIsPopup(!1)),!c.settings.isPopup&&!c.settings.isInline){c._createPicker();var l=a(c.oData.oInputElement).offset().top+a(c.oData.oInputElement).outerHeight(),m=a(c.oData.oInputElement).offset().left,n=a(c.oData.oInputElement).outerWidth();a(c.element).css({position:"absolute",top:l,left:m,width:n,height:"auto"})}c.settings.beforeShow&&c.settings.beforeShow.call(c,b),d=a.cf._isValid(d)?d:c.settings.mode,c.settings.mode=d,a.cf._isValid(g)||(a.cf._compare(d,"date")?g=c.settings.dateFormat:a.cf._compare(d,"time")?g=c.settings.timeFormat:a.cf._compare(d,"datetime")&&(g=c.settings.dateTimeFormat)),c._matchFormat(d,g),c.oData.dMinValue=null,c.oData.dMaxValue=null,c.oData.bIs12Hour=!1;var o,p,q,r,s,t,u,v;c.oData.bDateMode?(o=e||c.settings.minDate,p=f||c.settings.maxDate,c.oData.sDateFormat=g,a.cf._isValid(o)&&(c.oData.dMinValue=c._parseDate(o)),a.cf._isValid(p)&&(c.oData.dMaxValue=c._parseDate(p)),""!==i&&(a.cf._compare(i,"start")||a.cf._compare(i,"end"))&&""!==j&&a(j).length>=1&&(q=c._getValueOfElement(a(j)),""!==q&&(r=c.settings.parseDateTimeString?c.settings.parseDateTimeString.call(c,q,d,g,a(j)):c._parseDate(q),a.cf._compare(i,"start")?a.cf._isValid(p)?c._compareDates(r,c.oData.dMaxValue)<0&&(c.oData.dMaxValue=new Date(r)):c.oData.dMaxValue=new Date(r):a.cf._compare(i,"end")&&(a.cf._isValid(o)?c._compareDates(r,c.oData.dMinValue)>0&&(c.oData.dMinValue=new Date(r)):c.oData.dMinValue=new Date(r)))),c.settings.parseDateTimeString?c.oData.dCurrentDate=c.settings.parseDateTimeString.call(c,k,d,g,a(b)):c.oData.dCurrentDate=c._parseDate(k),c.oData.dCurrentDate.setHours(0),c.oData.dCurrentDate.setMinutes(0),c.oData.dCurrentDate.setSeconds(0)):c.oData.bTimeMode?(o=e||c.settings.minTime,p=f||c.settings.maxTime,c.oData.sTimeFormat=g,c.oData.bIs12Hour=c.getIs12Hour(),a.cf._isValid(o)&&(c.oData.dMinValue=c._parseTime(o),a.cf._isValid(p)||(c.oData.sTimeFormat===c.oData.sArrInputTimeFormats[0]?p="11:59:59 PM":c.oData.sTimeFormat===c.oData.sArrInputTimeFormats[1]?p="23:59:59":c.oData.sTimeFormat===c.oData.sArrInputTimeFormats[2]?p="11:59 PM":c.oData.sTimeFormat===c.oData.sArrInputTimeFormats[3]&&(p="23:59"),c.oData.dMaxValue=c._parseTime(p))),a.cf._isValid(p)&&(c.oData.dMaxValue=c._parseTime(p),a.cf._isValid(o)||(c.oData.sTimeFormat===c.oData.sArrInputTimeFormats[0]?o="12:00:00 AM":c.oData.sTimeFormat===c.oData.sArrInputTimeFormats[1]?o="00:00:00":c.oData.sTimeFormat===c.oData.sArrInputTimeFormats[2]?o="12:00 AM":c.oData.sTimeFormat===c.oData.sArrInputTimeFormats[3]&&(o="00:00"),c.oData.dMinValue=c._parseTime(o))),""!==i&&(a.cf._compare(i,"start")||a.cf._compare(i,"end"))&&""!==j&&a(j).length>=1&&(s=c._getValueOfElement(a(j)),""!==s&&(c.settings.parseDateTimeString?r=c.settings.parseDateTimeString.call(c,s,d,g,a(j)):t=c._parseTime(s),a.cf._compare(i,"start")?(t.setMinutes(t.getMinutes()-1),a.cf._isValid(p)?2===c._compareTime(t,c.oData.dMaxValue)&&(c.oData.dMaxValue=new Date(t)):c.oData.dMaxValue=new Date(t)):a.cf._compare(i,"end")&&(t.setMinutes(t.getMinutes()+1),a.cf._isValid(o)?3===c._compareTime(t,c.oData.dMinValue)&&(c.oData.dMinValue=new Date(t)):c.oData.dMinValue=new Date(t)))),c.settings.parseDateTimeString?c.oData.dCurrentDate=c.settings.parseDateTimeString.call(c,k,d,g,a(b)):c.oData.dCurrentDate=c._parseTime(k)):c.oData.bDateTimeMode&&(o=e||c.settings.minDateTime,p=f||c.settings.maxDateTime,c.oData.sDateTimeFormat=g,c.oData.bIs12Hour=c.getIs12Hour(),a.cf._isValid(o)&&(c.oData.dMinValue=c._parseDateTime(o)),a.cf._isValid(p)&&(c.oData.dMaxValue=c._parseDateTime(p)),""!==i&&(a.cf._compare(i,"start")||a.cf._compare(i,"end"))&&""!==j&&a(j).length>=1&&(u=c._getValueOfElement(a(j)),""!==u&&(v=c.settings.parseDateTimeString?c.settings.parseDateTimeString.call(c,u,d,g,a(j)):c._parseDateTime(u),a.cf._compare(i,"start")?a.cf._isValid(p)?c._compareDateTime(v,c.oData.dMaxValue)<0&&(c.oData.dMaxValue=new Date(v)):c.oData.dMaxValue=new Date(v):a.cf._compare(i,"end")&&(a.cf._isValid(o)?c._compareDateTime(v,c.oData.dMinValue)>0&&(c.oData.dMinValue=new Date(v)):c.oData.dMinValue=new Date(v)))),c.settings.parseDateTimeString?c.oData.dCurrentDate=c.settings.parseDateTimeString.call(c,k,d,g,a(b)):c.oData.dCurrentDate=c._parseDateTime(k)),c._setVariablesForDate(),c._modifyPicker(),a(c.element).fadeIn(c.settings.animationDuration),c.settings.afterShow&&setTimeout(function(){c.settings.afterShow.call(c,b)},c.settings.animationDuration)}},_hidePicker:function(b,c){var d=this,e=d.oData.oInputElement;d.settings.beforeHide&&d.settings.beforeHide.call(d,e),a.cf._isValid(b)||(b=d.settings.animationDuration),a.cf._isValid(d.oData.oInputElement)&&(a(d.oData.oInputElement).blur(),d.oData.oInputElement=null),a(d.element).fadeOut(b),0===b?a(d.element).find(".dtpicker-subcontent").html(""):setTimeout(function(){a(d.element).find(".dtpicker-subcontent").html("")},b),a(document).unbind("click.DateTimePicker keydown.DateTimePicker keyup.DateTimePicker"),d.settings.afterHide&&(0===b?d.settings.afterHide.call(d,e):setTimeout(function(){d.settings.afterHide.call(d,e)},b)),a.cf._isValid(c)&&d._showPicker(c)},_modifyPicker:function(){var b,c,d=this,e=[];d.oData.bDateMode?(b=d.settings.titleContentDate,c=3,d.oData.bArrMatchFormat[0]?e=["day","month","year"]:d.oData.bArrMatchFormat[1]?e=["month","day","year"]:d.oData.bArrMatchFormat[2]?e=["year","month","day"]:d.oData.bArrMatchFormat[3]?e=["day","month","year"]:d.oData.bArrMatchFormat[4]?(c=2,e=["month","year"]):d.oData.bArrMatchFormat[5]?(c=2,e=["month","year"]):d.oData.bArrMatchFormat[6]?(c=2,e=["month","year"]):d.oData.bArrMatchFormat[7]&&(c=2,e=["year","month"])):d.oData.bTimeMode?(b=d.settings.titleContentTime,d.oData.bArrMatchFormat[0]?(c=4,e=["hour","minutes","seconds","meridiem"]):d.oData.bArrMatchFormat[1]?(c=3,e=["hour","minutes","seconds"]):d.oData.bArrMatchFormat[2]?(c=3,e=["hour","minutes","meridiem"]):d.oData.bArrMatchFormat[3]&&(c=2,e=["hour","minutes"])):d.oData.bDateTimeMode&&(b=d.settings.titleContentDateTime,d.oData.bArrMatchFormat[0]?(c=6,e=["day","month","year","hour","minutes","seconds"]):d.oData.bArrMatchFormat[1]?(c=7,e=["day","month","year","hour","minutes","seconds","meridiem"]):d.oData.bArrMatchFormat[2]?(c=6,e=["month","day","year","hour","minutes","seconds"]):d.oData.bArrMatchFormat[3]?(c=7,e=["month","day","year","hour","minutes","seconds","meridiem"]):d.oData.bArrMatchFormat[4]?(c=6,e=["year","month","day","hour","minutes","seconds"]):d.oData.bArrMatchFormat[5]?(c=7,e=["year","month","day","hour","minutes","seconds","meridiem"]):d.oData.bArrMatchFormat[6]?(c=6,e=["day","month","year","hour","minutes","seconds"]):d.oData.bArrMatchFormat[7]?(c=7,e=["day","month","year","hour","minutes","seconds","meridiem"]):d.oData.bArrMatchFormat[8]?(c=5,e=["day","month","year","hour","minutes"]):d.oData.bArrMatchFormat[9]?(c=6,e=["day","month","year","hour","minutes","meridiem"]):d.oData.bArrMatchFormat[10]?(c=5,e=["month","day","year","hour","minutes"]):d.oData.bArrMatchFormat[11]?(c=6,e=["month","day","year","hour","minutes","meridiem"]):d.oData.bArrMatchFormat[12]?(c=5,e=["year","month","day","hour","minutes"]):d.oData.bArrMatchFormat[13]?(c=6,e=["year","month","day","hour","minutes","meridiem"]):d.oData.bArrMatchFormat[14]?(c=5,e=["day","month","year","hour","minutes"]):d.oData.bArrMatchFormat[15]&&(c=6,e=["day","month","year","hour","minutes","meridiem"]));var f,g="dtpicker-comp"+c,h=!1,i=!1,j=!1;for(f=0;f<d.settings.buttonsToDisplay.length;f++)a.cf._compare(d.settings.buttonsToDisplay[f],"HeaderCloseButton")?h=!0:a.cf._compare(d.settings.buttonsToDisplay[f],"SetButton")?i=!0:a.cf._compare(d.settings.buttonsToDisplay[f],"ClearButton")&&(j=!0);var k="";d.settings.showHeader&&(k+="<div class='dtpicker-header'>",k+="<div class='dtpicker-title'>"+b+"</div>",h&&(k+="<a class='dtpicker-close'>&times;</a>"),k+="<div class='dtpicker-value'></div>",k+="</div>");var l="";for(l+="<div class='dtpicker-components'>",f=0;f<c;f++){var m=e[f];l+="<div class='dtpicker-compOutline "+g+"'>",l+="<div class='dtpicker-comp "+m+"'>",l+="<a class='dtpicker-compButton increment'>"+d.settings.incrementButtonContent+"</a>",l+=d.settings.readonlyInputs?"<input type='text' class='dtpicker-compValue' readonly>":"<input type='text' class='dtpicker-compValue'>",l+="<a class='dtpicker-compButton decrement'>"+d.settings.decrementButtonContent+"</a>",d.settings.labels&&(l+="<div class='dtpicker-label'>"+d.settings.labels[m]+"</div>"),l+="</div>",l+="</div>"}l+="</div>";var n="";n=i&&j?" dtpicker-twoButtons":" dtpicker-singleButton";var o="";o+="<div class='dtpicker-buttonCont"+n+"'>",i&&(o+="<a class='dtpicker-button dtpicker-buttonSet'>"+d.settings.setButtonContent+"</a>"),j&&(o+="<a class='dtpicker-button dtpicker-buttonClear'>"+d.settings.clearButtonContent+"</a>"),o+="</div>";var p=k+l+o;a(d.element).find(".dtpicker-subcontent").html(p),d._setCurrentDate(),d._addEventHandlersForPicker()},_addEventHandlersForPicker:function(){var b,c,d=this;if(d.settings.isInline||a(document).on("click.DateTimePicker",function(a){d._hidePicker("")}),a(document).on("keydown.DateTimePicker",function(e){if(c=parseInt(e.keyCode?e.keyCode:e.which),!a(".dtpicker-compValue").is(":focus")&&9===c)return d._setButtonAction(!0),a("[tabIndex="+(d.oData.iTabIndex+1)+"]").focus(),!1;if(a(".dtpicker-compValue").is(":focus")){if(38===c)return b=a(".dtpicker-compValue:focus").parent().attr("class"),d._incrementDecrementActionsUsingArrowAndMouse(b,"inc"),!1;if(40===c)return b=a(".dtpicker-compValue:focus").parent().attr("class"),d._incrementDecrementActionsUsingArrowAndMouse(b,"dec"),!1}}),d.settings.isInline||a(document).on("keydown.DateTimePicker",function(b){c=parseInt(b.keyCode?b.keyCode:b.which),a(".dtpicker-compValue").is(":focus")||9===c||d._hidePicker("")}),a(".dtpicker-cont *").click(function(a){a.stopPropagation()}),d.settings.readonlyInputs||(a(".dtpicker-compValue").not(".month .dtpicker-compValue, .meridiem .dtpicker-compValue").keyup(function(){this.value=this.value.replace(/[^0-9\.]/g,"")}),a(".dtpicker-compValue").focus(function(){d.oData.bElemFocused=!0,a(this).select()}),a(".dtpicker-compValue").blur(function(){d._getValuesFromInputBoxes(),d._setCurrentDate(),d.oData.bElemFocused=!1;var b=a(this).parent().parent();setTimeout(function(){b.is(":last-child")&&!d.oData.bElemFocused&&d._setButtonAction(!1)},50)}),a(".dtpicker-compValue").keyup(function(b){var c,d=a(this),e=d.val(),f=e.length;d.parent().hasClass("day")||d.parent().hasClass("hour")||d.parent().hasClass("minutes")||d.parent().hasClass("meridiem")?f>2&&(c=e.slice(0,2),d.val(c)):d.parent().hasClass("month")?f>3&&(c=e.slice(0,3),d.val(c)):d.parent().hasClass("year")&&f>4&&(c=e.slice(0,4),d.val(c)),9===parseInt(b.keyCode?b.keyCode:b.which)&&a(this).select()})),a(d.element).find(".dtpicker-compValue").on("mousewheel DOMMouseScroll onmousewheel",function(c){if(a(".dtpicker-compValue").is(":focus")){var e=Math.max(-1,Math.min(1,c.originalEvent.wheelDelta));return e>0?(b=a(".dtpicker-compValue:focus").parent().attr("class"),d._incrementDecrementActionsUsingArrowAndMouse(b,"inc")):(b=a(".dtpicker-compValue:focus").parent().attr("class"),d._incrementDecrementActionsUsingArrowAndMouse(b,"dec")),!1}}),a(d.element).find(".dtpicker-close").click(function(a){d.settings.buttonClicked&&d.settings.buttonClicked.call(d,"CLOSE",d.oData.oInputElement),d.settings.isInline||d._hidePicker("")}),a(d.element).find(".dtpicker-buttonSet").click(function(a){d.settings.buttonClicked&&d.settings.buttonClicked.call(d,"SET",d.oData.oInputElement),d._setButtonAction(!1)}),a(d.element).find(".dtpicker-buttonClear").click(function(a){d.settings.buttonClicked&&d.settings.buttonClicked.call(d,"CLEAR",d.oData.oInputElement),d._clearButtonAction()}),d.settings.captureTouchHold||d.settings.captureMouseHold){var e="";d.settings.captureTouchHold&&d.oData.bIsTouchDevice&&(e+="touchstart touchmove touchend "),d.settings.captureMouseHold&&(e+="mousedown mouseup"),a(".dtpicker-cont *").on(e,function(a){d._clearIntervalForTouchEvents()}),d._bindTouchEvents("day"),d._bindTouchEvents("month"),d._bindTouchEvents("year"),d._bindTouchEvents("hour"),d._bindTouchEvents("minutes"),d._bindTouchEvents("seconds")}else a(d.element).find(".day .increment, .day .increment *").click(function(a){d.oData.iCurrentDay++,d._setCurrentDate(),d._setOutputOnIncrementOrDecrement()}),a(d.element).find(".day .decrement, .day .decrement *").click(function(a){d.oData.iCurrentDay--,d._setCurrentDate(),d._setOutputOnIncrementOrDecrement()}),a(d.element).find(".month .increment, .month .increment *").click(function(a){d.oData.iCurrentMonth++,d._setCurrentDate(),d._setOutputOnIncrementOrDecrement()}),a(d.element).find(".month .decrement, .month .decrement *").click(function(a){d.oData.iCurrentMonth--,d._setCurrentDate(),d._setOutputOnIncrementOrDecrement()}),a(d.element).find(".year .increment, .year .increment *").click(function(a){d.oData.iCurrentYear++,d._setCurrentDate(),d._setOutputOnIncrementOrDecrement()}),a(d.element).find(".year .decrement, .year .decrement *").click(function(a){d.oData.iCurrentYear--,d._setCurrentDate(),d._setOutputOnIncrementOrDecrement()}),a(d.element).find(".hour .increment, .hour .increment *").click(function(a){d.oData.iCurrentHour++,d._setCurrentDate(),d._setOutputOnIncrementOrDecrement()}),a(d.element).find(".hour .decrement, .hour .decrement *").click(function(a){d.oData.iCurrentHour--,d._setCurrentDate(),d._setOutputOnIncrementOrDecrement()}),a(d.element).find(".minutes .increment, .minutes .increment *").click(function(a){d.oData.iCurrentMinutes+=d.settings.minuteInterval,d._setCurrentDate(),d._setOutputOnIncrementOrDecrement()}),a(d.element).find(".minutes .decrement, .minutes .decrement *").click(function(a){d.oData.iCurrentMinutes-=d.settings.minuteInterval,d._setCurrentDate(),d._setOutputOnIncrementOrDecrement()}),a(d.element).find(".seconds .increment, .seconds .increment *").click(function(a){d.oData.iCurrentSeconds+=d.settings.secondsInterval,d._setCurrentDate(),d._setOutputOnIncrementOrDecrement()}),a(d.element).find(".seconds .decrement, .seconds .decrement *").click(function(a){d.oData.iCurrentSeconds-=d.settings.secondsInterval,d._setCurrentDate(),d._setOutputOnIncrementOrDecrement()});a(d.element).find(".meridiem .dtpicker-compButton, .meridiem .dtpicker-compButton *").click(function(b){a.cf._compare(d.oData.sCurrentMeridiem,"AM")?(d.oData.sCurrentMeridiem="PM",d.oData.iCurrentHour+=12):a.cf._compare(d.oData.sCurrentMeridiem,"PM")&&(d.oData.sCurrentMeridiem="AM",d.oData.iCurrentHour-=12),d._setCurrentDate(),d._setOutputOnIncrementOrDecrement()})},_adjustMinutes:function(a){var b=this;return b.settings.roundOffMinutes&&1!==b.settings.minuteInterval&&(a=a%b.settings.minuteInterval?a-a%b.settings.minuteInterval+b.settings.minuteInterval:a),a},_adjustSeconds:function(a){var b=this;return b.settings.roundOffSeconds&&1!==b.settings.secondsInterval&&(a=a%b.settings.secondsInterval?a-a%b.settings.secondsInterval+b.settings.secondsInterval:a),a},_getValueOfElement:function(b){var c="";return c=a.cf._compare(a(b).prop("tagName"),"INPUT")?a(b).val():a(b).html()},_setValueOfElement:function(b,c){var d=this;a.cf._isValid(c)||(c=a(d.oData.oInputElement)),a.cf._compare(c.prop("tagName"),"INPUT")?c.val(b):c.html(b);var e=d.getDateObjectForInputField(c);return d.settings.settingValueOfElement&&d.settings.settingValueOfElement.call(d,b,e,c),c.change(),b},_bindTouchEvents:function(b){var c=this;a(c.element).find("."+b+" .increment, ."+b+" .increment *").on("touchstart mousedown",function(d){d.stopPropagation(),a.cf._isValid(c.oData.sTouchButton)||(c.oData.iTouchStart=(new Date).getTime(),
c.oData.sTouchButton=b+"-inc",c._setIntervalForTouchEvents())}),a(c.element).find("."+b+" .increment, ."+b+" .increment *").on("touchend mouseup",function(a){a.stopPropagation(),c._clearIntervalForTouchEvents()}),a(c.element).find("."+b+" .decrement, ."+b+" .decrement *").on("touchstart mousedown",function(d){d.stopPropagation(),a.cf._isValid(c.oData.sTouchButton)||(c.oData.iTouchStart=(new Date).getTime(),c.oData.sTouchButton=b+"-dec",c._setIntervalForTouchEvents())}),a(c.element).find("."+b+" .decrement, ."+b+" .decrement *").on("touchend mouseup",function(a){a.stopPropagation(),c._clearIntervalForTouchEvents()})},_setIntervalForTouchEvents:function(){var b=this,c=b.oData.bIsTouchDevice?b.settings.touchHoldInterval:b.settings.mouseHoldInterval;if(!a.cf._isValid(b.oData.oTimeInterval)){var d;b.oData.oTimeInterval=setInterval(function(){d=(new Date).getTime()-b.oData.iTouchStart,d>c&&a.cf._isValid(b.oData.sTouchButton)&&("day-inc"===b.oData.sTouchButton?b.oData.iCurrentDay++:"day-dec"===b.oData.sTouchButton?b.oData.iCurrentDay--:"month-inc"===b.oData.sTouchButton?b.oData.iCurrentMonth++:"month-dec"===b.oData.sTouchButton?b.oData.iCurrentMonth--:"year-inc"===b.oData.sTouchButton?b.oData.iCurrentYear++:"year-dec"===b.oData.sTouchButton?b.oData.iCurrentYear--:"hour-inc"===b.oData.sTouchButton?b.oData.iCurrentHour++:"hour-dec"===b.oData.sTouchButton?b.oData.iCurrentHour--:"minute-inc"===b.oData.sTouchButton?b.oData.iCurrentMinutes+=b.settings.minuteInterval:"minute-dec"===b.oData.sTouchButton?b.oData.iCurrentMinutes-=b.settings.minuteInterval:"second-inc"===b.oData.sTouchButton?b.oData.iCurrentSeconds+=b.settings.secondsInterval:"second-dec"===b.oData.sTouchButton&&(b.oData.iCurrentSeconds-=b.settings.secondsInterval),b._setCurrentDate(),b._setOutputOnIncrementOrDecrement(),b.oData.iTouchStart=(new Date).getTime())},c)}},_clearIntervalForTouchEvents:function(){var b=this;clearInterval(b.oData.oTimeInterval),a.cf._isValid(b.oData.sTouchButton)&&(b.oData.sTouchButton=null,b.oData.iTouchStart=0),b.oData.oTimeInterval=null},_incrementDecrementActionsUsingArrowAndMouse:function(a,b){var c=this;a.includes("day")?"inc"===b?c.oData.iCurrentDay++:"dec"===b&&c.oData.iCurrentDay--:a.includes("month")?"inc"===b?c.oData.iCurrentMonth++:"dec"===b&&c.oData.iCurrentMonth--:a.includes("year")?"inc"===b?c.oData.iCurrentYear++:"dec"===b&&c.oData.iCurrentYear--:a.includes("hour")?"inc"===b?c.oData.iCurrentHour++:"dec"===b&&c.oData.iCurrentHour--:a.includes("minutes")?"inc"===b?c.oData.iCurrentMinutes+=c.settings.minuteInterval:"dec"===b&&(c.oData.iCurrentMinutes-=c.settings.minuteInterval):a.includes("seconds")&&("inc"===b?c.oData.iCurrentSeconds+=c.settings.secondsInterval:"dec"===b&&(c.oData.iCurrentSeconds-=c.settings.secondsInterval)),c._setCurrentDate(),c._setOutputOnIncrementOrDecrement()},_parseDate:function(b){var c=this,d=c.settings.defaultDate?new Date(c.settings.defaultDate):new Date,e=d.getDate(),f=d.getMonth(),g=d.getFullYear();if(a.cf._isValid(b))if("string"==typeof b){var h;h=c.oData.bArrMatchFormat[4]||c.oData.bArrMatchFormat[5]||c.oData.bArrMatchFormat[6]?b.split(c.settings.monthYearSeparator):b.split(c.settings.dateSeparator),c.oData.bArrMatchFormat[0]?(e=parseInt(h[0]),f=parseInt(h[1]-1),g=parseInt(h[2])):c.oData.bArrMatchFormat[1]?(f=parseInt(h[0]-1),e=parseInt(h[1]),g=parseInt(h[2])):c.oData.bArrMatchFormat[2]?(g=parseInt(h[0]),f=parseInt(h[1]-1),e=parseInt(h[2])):c.oData.bArrMatchFormat[3]?(e=parseInt(h[0]),f=c._getShortMonthIndex(h[1]),g=parseInt(h[2])):c.oData.bArrMatchFormat[4]?(e=1,f=parseInt(h[0])-1,g=parseInt(h[1])):c.oData.bArrMatchFormat[5]?(e=1,f=c._getShortMonthIndex(h[0]),g=parseInt(h[1])):c.oData.bArrMatchFormat[6]?(e=1,f=c._getFullMonthIndex(h[0]),g=parseInt(h[1])):c.oData.bArrMatchFormat[7]&&(e=1,f=parseInt(h[1])-1,g=parseInt(h[0]))}else e=b.getDate(),f=b.getMonth(),g=b.getFullYear();return d=new Date(g,f,e,0,0,0,0)},_parseTime:function(b){var c,d,e,f=this,g=f.settings.defaultDate?new Date(f.settings.defaultDate):new Date,h=g.getDate(),i=g.getMonth(),j=g.getFullYear(),k=g.getHours(),l=g.getMinutes(),m=g.getSeconds(),n=f.oData.bArrMatchFormat[0]||f.oData.bArrMatchFormat[1];return m=n?f._adjustSeconds(m):0,a.cf._isValid(b)&&("string"==typeof b?(f.oData.bIs12Hour&&(c=b.split(f.settings.timeMeridiemSeparator),b=c[0],d=c[1],a.cf._compare(d,"AM")||a.cf._compare(d,"PM")||(d="")),e=b.split(f.settings.timeSeparator),k=parseInt(e[0]),l=parseInt(e[1]),n&&(m=parseInt(e[2]),m=f._adjustSeconds(m)),12===k&&a.cf._compare(d,"AM")?k=0:k<12&&a.cf._compare(d,"PM")&&(k+=12)):(k=b.getHours(),l=b.getMinutes(),n&&(m=b.getSeconds(),m=f._adjustSeconds(m)))),l=f._adjustMinutes(l),g=new Date(j,i,h,k,l,m,0)},_parseDateTime:function(b){var c,d,e,f,g,h=this,i=h.settings.defaultDate?new Date(h.settings.defaultDate):new Date,j=i.getDate(),k=i.getMonth(),l=i.getFullYear(),m=i.getHours(),n=i.getMinutes(),o=i.getSeconds(),p="",q=h.oData.bArrMatchFormat[0]||h.oData.bArrMatchFormat[1]||h.oData.bArrMatchFormat[2]||h.oData.bArrMatchFormat[3]||h.oData.bArrMatchFormat[4]||h.oData.bArrMatchFormat[5]||h.oData.bArrMatchFormat[6]||h.oData.bArrMatchFormat[7];return o=q?h._adjustSeconds(o):0,a.cf._isValid(b)&&("string"==typeof b?(c=b.split(h.settings.dateTimeSeparator),d=c[0].split(h.settings.dateSeparator),h.oData.bArrMatchFormat[0]||h.oData.bArrMatchFormat[1]||h.oData.bArrMatchFormat[8]||h.oData.bArrMatchFormat[9]?(j=parseInt(d[0]),k=parseInt(d[1]-1),l=parseInt(d[2])):h.oData.bArrMatchFormat[2]||h.oData.bArrMatchFormat[3]||h.oData.bArrMatchFormat[10]||h.oData.bArrMatchFormat[11]?(k=parseInt(d[0]-1),j=parseInt(d[1]),l=parseInt(d[2])):h.oData.bArrMatchFormat[4]||h.oData.bArrMatchFormat[5]||h.oData.bArrMatchFormat[12]||h.oData.bArrMatchFormat[13]?(l=parseInt(d[0]),k=parseInt(d[1]-1),j=parseInt(d[2])):(h.oData.bArrMatchFormat[6]||h.oData.bArrMatchFormat[7]||h.oData.bArrMatchFormat[14]||h.oData.bArrMatchFormat[15])&&(j=parseInt(d[0]),k=h._getShortMonthIndex(d[1]),l=parseInt(d[2])),e=c[1],a.cf._isValid(e)&&(h.oData.bIs12Hour&&(a.cf._compare(h.settings.dateTimeSeparator,h.settings.timeMeridiemSeparator)&&3===c.length?p=c[2]:(f=e.split(h.settings.timeMeridiemSeparator),e=f[0],p=f[1]),a.cf._compare(p,"AM")||a.cf._compare(p,"PM")||(p="")),g=e.split(h.settings.timeSeparator),m=parseInt(g[0]),n=parseInt(g[1]),q&&(o=parseInt(g[2])),12===m&&a.cf._compare(p,"AM")?m=0:m<12&&a.cf._compare(p,"PM")&&(m+=12))):(j=b.getDate(),k=b.getMonth(),l=b.getFullYear(),m=b.getHours(),n=b.getMinutes(),q&&(o=b.getSeconds(),o=h._adjustSeconds(o)))),n=h._adjustMinutes(n),i=new Date(l,k,j,m,n,o,0)},_getShortMonthIndex:function(b){for(var c=this,d=0;d<c.settings.shortMonthNames.length;d++)if(a.cf._compare(b,c.settings.shortMonthNames[d]))return d},_getFullMonthIndex:function(b){for(var c=this,d=0;d<c.settings.fullMonthNames.length;d++)if(a.cf._compare(b,c.settings.fullMonthNames[d]))return d},getIs12Hour:function(a,b){var c=this,d=!1,e=Function.length;return c._setMatchFormat(e,a,b),c.oData.bTimeMode?d=c.oData.bArrMatchFormat[0]||c.oData.bArrMatchFormat[2]:c.oData.bDateTimeMode&&(d=c.oData.bArrMatchFormat[1]||c.oData.bArrMatchFormat[3]||c.oData.bArrMatchFormat[5]||c.oData.bArrMatchFormat[7]||c.oData.bArrMatchFormat[9]||c.oData.bArrMatchFormat[11]||c.oData.bArrMatchFormat[13]||c.oData.bArrMatchFormat[15]),c._setMatchFormat(e),d},_setVariablesForDate:function(b,c,d){var e,f=this,g={},h=a.cf._isValid(b);return h?(e=new Date(b),a.cf._isValid(c)||(c=!0),a.cf._isValid(d)||(d=!0)):(e="[object Date]"===Object.prototype.toString.call(f.oData.dCurrentDate)&&isFinite(f.oData.dCurrentDate)?new Date(f.oData.dCurrentDate):new Date,a.cf._isValid(c)||(c=f.oData.bTimeMode||f.oData.bDateTimeMode),a.cf._isValid(d)||(d=f.oData.bIs12Hour)),g.iCurrentDay=e.getDate(),g.iCurrentMonth=e.getMonth(),g.iCurrentYear=e.getFullYear(),g.iCurrentWeekday=e.getDay(),c&&(g.iCurrentHour=e.getHours(),g.iCurrentMinutes=e.getMinutes(),g.iCurrentSeconds=e.getSeconds(),d&&(g.sCurrentMeridiem=f._determineMeridiemFromHourAndMinutes(g.iCurrentHour,g.iCurrentMinutes))),h?g:void(f.oData=a.extend(f.oData,g))},_getValuesFromInputBoxes:function(){var b=this;if(b.oData.bDateMode||b.oData.bDateTimeMode){var c,d;c=a(b.element).find(".month .dtpicker-compValue").val(),c.length>1&&(c=c.charAt(0).toUpperCase()+c.slice(1)),d=b.settings.shortMonthNames.indexOf(c),d!==-1?b.oData.iCurrentMonth=parseInt(d):c.match("^[+|-]?[0-9]+$")&&(b.oData.iCurrentMonth=parseInt(c-1)),b.oData.iCurrentDay=parseInt(a(b.element).find(".day .dtpicker-compValue").val())||b.oData.iCurrentDay,b.oData.iCurrentYear=parseInt(a(b.element).find(".year .dtpicker-compValue").val())||b.oData.iCurrentYear}if(b.oData.bTimeMode||b.oData.bDateTimeMode){var e,f,g,h;e=parseInt(a(b.element).find(".hour .dtpicker-compValue").val()),f=b._adjustMinutes(parseInt(a(b.element).find(".minutes .dtpicker-compValue").val())),g=b._adjustMinutes(parseInt(a(b.element).find(".seconds .dtpicker-compValue").val())),b.oData.iCurrentHour=isNaN(e)?b.oData.iCurrentHour:e,b.oData.iCurrentMinutes=isNaN(f)?b.oData.iCurrentMinutes:f,b.oData.iCurrentSeconds=isNaN(g)?b.oData.iCurrentSeconds:g,b.oData.iCurrentSeconds>59&&(b.oData.iCurrentMinutes+=b.oData.iCurrentSeconds/60,b.oData.iCurrentSeconds=b.oData.iCurrentSeconds%60),b.oData.iCurrentMinutes>59&&(b.oData.iCurrentHour+=b.oData.iCurrentMinutes/60,b.oData.iCurrentMinutes=b.oData.iCurrentMinutes%60),b.oData.bIs12Hour?b.oData.iCurrentHour>12&&(b.oData.iCurrentHour=b.oData.iCurrentHour%12):b.oData.iCurrentHour>23&&(b.oData.iCurrentHour=b.oData.iCurrentHour%23),b.oData.bIs12Hour&&(h=a(b.element).find(".meridiem .dtpicker-compValue").val(),(a.cf._compare(h,"AM")||a.cf._compare(h,"PM"))&&(b.oData.sCurrentMeridiem=h),a.cf._compare(b.oData.sCurrentMeridiem,"PM")&&12!==b.oData.iCurrentHour&&b.oData.iCurrentHour<13&&(b.oData.iCurrentHour+=12),a.cf._compare(b.oData.sCurrentMeridiem,"AM")&&12===b.oData.iCurrentHour&&(b.oData.iCurrentHour=0))}},_setCurrentDate:function(){var b=this;(b.oData.bTimeMode||b.oData.bDateTimeMode)&&(b.oData.iCurrentSeconds>59?(b.oData.iCurrentMinutes+=b.oData.iCurrentSeconds/60,b.oData.iCurrentSeconds=b.oData.iCurrentSeconds%60):b.oData.iCurrentSeconds<0&&(b.oData.iCurrentMinutes-=b.settings.minuteInterval,b.oData.iCurrentSeconds+=60),b.oData.iCurrentMinutes=b._adjustMinutes(b.oData.iCurrentMinutes),b.oData.iCurrentSeconds=b._adjustSeconds(b.oData.iCurrentSeconds));var c,d,e,f,g,h,i,j=new Date(b.oData.iCurrentYear,b.oData.iCurrentMonth,b.oData.iCurrentDay,b.oData.iCurrentHour,b.oData.iCurrentMinutes,b.oData.iCurrentSeconds,0),k=!1,l=!1;if(null!==b.oData.dMaxValue&&(k=j.getTime()>b.oData.dMaxValue.getTime()),null!==b.oData.dMinValue&&(l=j.getTime()<b.oData.dMinValue.getTime()),k||l){var m=!1,n=!1;null!==b.oData.dMaxValue&&(m=b.oData.dCurrentDate.getTime()>b.oData.dMaxValue.getTime()),null!==b.oData.dMinValue&&(n=b.oData.dCurrentDate.getTime()<b.oData.dMinValue.getTime()),m||n?(m&&(j=new Date(b.oData.dMaxValue)),n&&(j=new Date(b.oData.dMinValue))):j=new Date(b.oData.dCurrentDate)}if(b.oData.dCurrentDate=new Date(j),b._setVariablesForDate(),d={},g="",h="",i="",(b.oData.bDateMode||b.oData.bDateTimeMode)&&(b.oData.bDateMode&&(b.oData.bArrMatchFormat[4]||b.oData.bArrMatchFormat[5]||b.oData.bArrMatchFormat[6])&&(b.oData.iCurrentDay=1),e=b._formatDate(),a(b.element).find(".day .dtpicker-compValue").val(e.dd),b.oData.bDateMode?b.oData.bArrMatchFormat[4]||b.oData.bArrMatchFormat[7]?a(b.element).find(".month .dtpicker-compValue").val(e.MM):b.oData.bArrMatchFormat[6]?a(b.element).find(".month .dtpicker-compValue").val(e.month):a(b.element).find(".month .dtpicker-compValue").val(e.monthShort):a(b.element).find(".month .dtpicker-compValue").val(e.monthShort),a(b.element).find(".year .dtpicker-compValue").val(e.yyyy),b.settings.formatHumanDate?d=a.extend(d,e):b.oData.bDateMode&&(b.oData.bArrMatchFormat[4]||b.oData.bArrMatchFormat[5]||b.oData.bArrMatchFormat[6]||b.oData.bArrMatchFormat[7])?b.oData.bArrMatchFormat[4]?g=e.MM+b.settings.monthYearSeparator+e.yyyy:b.oData.bArrMatchFormat[5]?g=e.monthShort+b.settings.monthYearSeparator+e.yyyy:b.oData.bArrMatchFormat[6]?g=e.month+b.settings.monthYearSeparator+e.yyyy:b.oData.bArrMatchFormat[7]&&(g=e.yyyy+b.settings.monthYearSeparator+e.MM):g=e.dayShort+", "+e.month+" "+e.dd+", "+e.yyyy),b.oData.bTimeMode||b.oData.bDateTimeMode)if(f=b._formatTime(),b.oData.bIs12Hour&&a(b.element).find(".meridiem .dtpicker-compValue").val(b.oData.sCurrentMeridiem),a(b.element).find(".hour .dtpicker-compValue").val(f.hour),a(b.element).find(".minutes .dtpicker-compValue").val(f.mm),a(b.element).find(".seconds .dtpicker-compValue").val(f.ss),b.settings.formatHumanDate)d=a.extend(d,f);else{var o=b.oData.bTimeMode&&(b.oData.bArrMatchFormat[0]||b.oData.bArrMatchFormat[1]),p=b.oData.bDateTimeMode&&(b.oData.bArrMatchFormat[0]||b.oData.bArrMatchFormat[1]||b.oData.bArrMatchFormat[2]||b.oData.bArrMatchFormat[3]||b.oData.bArrMatchFormat[4]||b.oData.bArrMatchFormat[5]||b.oData.bArrMatchFormat[6]||b.oData.bArrMatchFormat[7]);h=o||p?f.hour+b.settings.timeSeparator+f.mm+b.settings.timeSeparator+f.ss:f.hour+b.settings.timeSeparator+f.mm,b.oData.bIs12Hour&&(h+=b.settings.timeMeridiemSeparator+b.oData.sCurrentMeridiem)}b.settings.formatHumanDate?(b.oData.bDateTimeMode?c=b.oData.sDateFormat:b.oData.bDateMode?c=b.oData.sTimeFormat:b.oData.bTimeMode&&(c=b.oData.sDateTimeFormat),i=b.settings.formatHumanDate.call(b,d,b.settings.mode,c)):b.oData.bDateTimeMode?i=g+b.settings.dateTimeSeparator+h:b.oData.bDateMode?i=g:b.oData.bTimeMode&&(i=h),a(b.element).find(".dtpicker-value").html(i),b._setButtons()},_formatDate:function(b){var c,d,e,f,g,h,i,j,k,l=this,m={};return a.cf._isValid(b)?m=a.extend({},b):(m.iCurrentDay=l.oData.iCurrentDay,m.iCurrentMonth=l.oData.iCurrentMonth,m.iCurrentYear=l.oData.iCurrentYear,m.iCurrentWeekday=l.oData.iCurrentWeekday),c=m.iCurrentDay,c=c<10?"0"+c:c,e=m.iCurrentMonth,f=m.iCurrentMonth+1,f=f<10?"0"+f:f,g=l.settings.shortMonthNames[e],h=l.settings.fullMonthNames[e],d=m.iCurrentYear,i=m.iCurrentWeekday,j=l.settings.shortDayNames[i],k=l.settings.fullDayNames[i],{dd:c,MM:f,monthShort:g,month:h,yyyy:d,dayShort:j,day:k}},_formatTime:function(b){var c,d,e,f,g,h,i,j=this,k={};return a.cf._isValid(b)?k=a.extend({},b):(k.iCurrentHour=j.oData.iCurrentHour,k.iCurrentMinutes=j.oData.iCurrentMinutes,k.iCurrentSeconds=j.oData.iCurrentSeconds,k.sCurrentMeridiem=j.oData.sCurrentMeridiem),c=k.iCurrentHour,d=c<10?"0"+c:c,g=d,e=k.iCurrentHour,e>12&&(e-=12),"00"===g&&(e=12),f=e<10?"0"+e:e,j.oData.bIs12Hour&&(g=f),h=k.iCurrentMinutes,h=h<10?"0"+h:h,i=k.iCurrentSeconds,i=i<10?"0"+i:i,{H:c,HH:d,h:e,hh:f,hour:g,m:k.iCurrentMinutes,mm:h,s:k.iCurrentSeconds,ss:i,ME:k.sCurrentMeridiem}},_setButtons:function(){var b=this;a(b.element).find(".dtpicker-compButton").removeClass("dtpicker-compButtonDisable").addClass("dtpicker-compButtonEnable");var c;if(null!==b.oData.dMaxValue&&(b.oData.bTimeMode?((b.oData.iCurrentHour+1>b.oData.dMaxValue.getHours()||b.oData.iCurrentHour+1===b.oData.dMaxValue.getHours()&&b.oData.iCurrentMinutes>b.oData.dMaxValue.getMinutes())&&a(b.element).find(".hour .increment").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"),b.oData.iCurrentHour>=b.oData.dMaxValue.getHours()&&b.oData.iCurrentMinutes+1>b.oData.dMaxValue.getMinutes()&&a(b.element).find(".minutes .increment").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable")):(c=new Date(b.oData.iCurrentYear,b.oData.iCurrentMonth,b.oData.iCurrentDay+1,b.oData.iCurrentHour,b.oData.iCurrentMinutes,b.oData.iCurrentSeconds,0),c.getTime()>b.oData.dMaxValue.getTime()&&a(b.element).find(".day .increment").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"),c=new Date(b.oData.iCurrentYear,b.oData.iCurrentMonth+1,b.oData.iCurrentDay,b.oData.iCurrentHour,b.oData.iCurrentMinutes,b.oData.iCurrentSeconds,0),c.getTime()>b.oData.dMaxValue.getTime()&&a(b.element).find(".month .increment").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"),c=new Date(b.oData.iCurrentYear+1,b.oData.iCurrentMonth,b.oData.iCurrentDay,b.oData.iCurrentHour,b.oData.iCurrentMinutes,b.oData.iCurrentSeconds,0),c.getTime()>b.oData.dMaxValue.getTime()&&a(b.element).find(".year .increment").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"),c=new Date(b.oData.iCurrentYear,b.oData.iCurrentMonth,b.oData.iCurrentDay,b.oData.iCurrentHour+1,b.oData.iCurrentMinutes,b.oData.iCurrentSeconds,0),c.getTime()>b.oData.dMaxValue.getTime()&&a(b.element).find(".hour .increment").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"),c=new Date(b.oData.iCurrentYear,b.oData.iCurrentMonth,b.oData.iCurrentDay,b.oData.iCurrentHour,b.oData.iCurrentMinutes+1,b.oData.iCurrentSeconds,0),c.getTime()>b.oData.dMaxValue.getTime()&&a(b.element).find(".minutes .increment").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"),c=new Date(b.oData.iCurrentYear,b.oData.iCurrentMonth,b.oData.iCurrentDay,b.oData.iCurrentHour,b.oData.iCurrentMinutes,b.oData.iCurrentSeconds+1,0),c.getTime()>b.oData.dMaxValue.getTime()&&a(b.element).find(".seconds .increment").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"))),null!==b.oData.dMinValue&&(b.oData.bTimeMode?((b.oData.iCurrentHour-1<b.oData.dMinValue.getHours()||b.oData.iCurrentHour-1===b.oData.dMinValue.getHours()&&b.oData.iCurrentMinutes<b.oData.dMinValue.getMinutes())&&a(b.element).find(".hour .decrement").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"),b.oData.iCurrentHour<=b.oData.dMinValue.getHours()&&b.oData.iCurrentMinutes-1<b.oData.dMinValue.getMinutes()&&a(b.element).find(".minutes .decrement").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable")):(c=new Date(b.oData.iCurrentYear,b.oData.iCurrentMonth,b.oData.iCurrentDay-1,b.oData.iCurrentHour,b.oData.iCurrentMinutes,b.oData.iCurrentSeconds,0),c.getTime()<b.oData.dMinValue.getTime()&&a(b.element).find(".day .decrement").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"),c=new Date(b.oData.iCurrentYear,b.oData.iCurrentMonth-1,b.oData.iCurrentDay,b.oData.iCurrentHour,b.oData.iCurrentMinutes,b.oData.iCurrentSeconds,0),c.getTime()<b.oData.dMinValue.getTime()&&a(b.element).find(".month .decrement").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"),c=new Date(b.oData.iCurrentYear-1,b.oData.iCurrentMonth,b.oData.iCurrentDay,b.oData.iCurrentHour,b.oData.iCurrentMinutes,b.oData.iCurrentSeconds,0),c.getTime()<b.oData.dMinValue.getTime()&&a(b.element).find(".year .decrement").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"),c=new Date(b.oData.iCurrentYear,b.oData.iCurrentMonth,b.oData.iCurrentDay,b.oData.iCurrentHour-1,b.oData.iCurrentMinutes,b.oData.iCurrentSeconds,0),c.getTime()<b.oData.dMinValue.getTime()&&a(b.element).find(".hour .decrement").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"),c=new Date(b.oData.iCurrentYear,b.oData.iCurrentMonth,b.oData.iCurrentDay,b.oData.iCurrentHour,b.oData.iCurrentMinutes-1,b.oData.iCurrentSeconds,0),c.getTime()<b.oData.dMinValue.getTime()&&a(b.element).find(".minutes .decrement").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"),c=new Date(b.oData.iCurrentYear,b.oData.iCurrentMonth,b.oData.iCurrentDay,b.oData.iCurrentHour,b.oData.iCurrentMinutes,b.oData.iCurrentSeconds-1,0),c.getTime()<b.oData.dMinValue.getTime()&&a(b.element).find(".seconds .decrement").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable"))),b.oData.bIs12Hour){var d,e;null===b.oData.dMaxValue&&null===b.oData.dMinValue||(d=b.oData.iCurrentHour,a.cf._compare(b.oData.sCurrentMeridiem,"AM")?d+=12:a.cf._compare(b.oData.sCurrentMeridiem,"PM")&&(d-=12),c=new Date(b.oData.iCurrentYear,b.oData.iCurrentMonth,b.oData.iCurrentDay,d,b.oData.iCurrentMinutes,b.oData.iCurrentSeconds,0),null!==b.oData.dMaxValue&&(b.oData.bTimeMode?(e=b.oData.iCurrentMinutes,(d>b.oData.dMaxValue.getHours()||d===b.oData.dMaxValue.getHours()&&e>b.oData.dMaxValue.getMinutes())&&a(b.element).find(".meridiem .dtpicker-compButton").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable")):c.getTime()>b.oData.dMaxValue.getTime()&&a(b.element).find(".meridiem .dtpicker-compButton").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable")),null!==b.oData.dMinValue&&(b.oData.bTimeMode?(e=b.oData.iCurrentMinutes,(d<b.oData.dMinValue.getHours()||d===b.oData.dMinValue.getHours()&&e<b.oData.dMinValue.getMinutes())&&a(b.element).find(".meridiem .dtpicker-compButton").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable")):c.getTime()<b.oData.dMinValue.getTime()&&a(b.element).find(".meridiem .dtpicker-compButton").removeClass("dtpicker-compButtonEnable").addClass("dtpicker-compButtonDisable")))}},setIsPopup:function(b){var c=this;if(!c.settings.isInline)if(c.settings.isPopup=b,"none"!==a(c.element).css("display")&&c._hidePicker(0),c.settings.isPopup)a(c.element).addClass("dtpicker-mobile"),a(c.element).css({position:"fixed",top:0,left:0,width:"100%",height:"100%"});else if(a(c.element).removeClass("dtpicker-mobile"),null!==c.oData.oInputElement){var d=a(c.oData.oInputElement).offset().top+a(c.oData.oInputElement).outerHeight(),e=a(c.oData.oInputElement).offset().left,f=a(c.oData.oInputElement).outerWidth();a(c.element).css({position:"absolute",top:d,left:e,width:f,height:"auto"})}},_compareDates:function(a,b){a=new Date(a.getDate(),a.getMonth(),a.getFullYear(),0,0,0,0);var c=(a.getTime()-b.getTime())/864e5;return 0===c?c:c/Math.abs(c)},_compareTime:function(a,b){var c=0;return a.getHours()===b.getHours()&&a.getMinutes()===b.getMinutes()?c=1:a.getHours()<b.getHours()?c=2:a.getHours()>b.getHours()?c=3:a.getHours()===b.getHours()&&(a.getMinutes()<b.getMinutes()?c=2:a.getMinutes()>b.getMinutes()&&(c=3)),c},_compareDateTime:function(a,b){var c=(a.getTime()-b.getTime())/6e4;return 0===c?c:c/Math.abs(c)},_determineMeridiemFromHourAndMinutes:function(a,b){return a>12||12===a&&b>=0?"PM":"AM"},setLanguage:function(b){var c=this;return c.settings=a.extend({},a.DateTimePicker.defaults,a.DateTimePicker.i18n[b],c.options),c.settings.language=b,c._setDateFormatArray(),c._setTimeFormatArray(),c._setDateTimeFormatArray(),c}}});

/***/ }),

/***/ "./src/common/index.js":
/*!*****************************!*\
  !*** ./src/common/index.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/common/models/Answer.js":
/*!*************************************!*\
  !*** ./src/common/models/Answer.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Answer; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/Model */ "flarum/Model");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_Model__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/utils/mixin */ "flarum/utils/mixin");
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__);




var Answer =
/*#__PURE__*/
function (_mixin) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Answer, _mixin);

  function Answer() {
    return _mixin.apply(this, arguments) || this;
  }

  var _proto = Answer.prototype;

  _proto.apiEndpoint = function apiEndpoint() {
    return "/reflar/polls/answers" + (this.exists ? "/" + this.data.id : '');
  };

  return Answer;
}(flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default()(flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a, {
  answer: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('answer'),
  votes: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('votes'),
  percent: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('percent')
}));



/***/ }),

/***/ "./src/common/models/Question.js":
/*!***************************************!*\
  !*** ./src/common/models/Question.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Question; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/Model */ "flarum/Model");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_Model__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/utils/mixin */ "flarum/utils/mixin");
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__);




var Question =
/*#__PURE__*/
function (_mixin) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Question, _mixin);

  function Question() {
    return _mixin.apply(this, arguments) || this;
  }

  var _proto = Question.prototype;

  _proto.apiEndpoint = function apiEndpoint() {
    return "/reflar/polls" + (this.exists ? "/" + this.data.id : '');
  };

  return Question;
}(flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default()(flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a, {
  question: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('question'),
  isEnded: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('isEnded'),
  endDate: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('endDate'),
  isPublic: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('isPublic'),
  answers: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.hasMany('answers'),
  votes: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.hasMany('votes')
}));



/***/ }),

/***/ "./src/common/models/Vote.js":
/*!***********************************!*\
  !*** ./src/common/models/Vote.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Vote; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/Model */ "flarum/Model");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_Model__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/utils/mixin */ "flarum/utils/mixin");
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__);




var Vote =
/*#__PURE__*/
function (_mixin) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Vote, _mixin);

  function Vote() {
    return _mixin.apply(this, arguments) || this;
  }

  var _proto = Vote.prototype;

  _proto.apiEndpoint = function apiEndpoint() {
    return "/reflar/polls/votes" + (this.exists ? "/" + this.data.id : '');
  };

  return Vote;
}(flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default()(flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a, {
  poll_id: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('poll_id'),
  user_id: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('user_id'),
  option_id: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('option_id')
}));



/***/ }),

/***/ "./src/forum/PollControl.js":
/*!**********************************!*\
  !*** ./src/forum/PollControl.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_utils_PostControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/utils/PostControls */ "flarum/utils/PostControls");
/* harmony import */ var flarum_utils_PostControls__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_PostControls__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_EditPollModal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/EditPollModal */ "./src/forum/components/EditPollModal.js");




/* harmony default export */ __webpack_exports__["default"] = (function () {
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_utils_PostControls__WEBPACK_IMPORTED_MODULE_1___default.a, 'moderationControls', function (items, post) {
    var discussion = post.discussion();
    var poll = discussion.Poll();
    var user = app.session.user;

    if (discussion.Poll() && (user !== undefined && user.canEditPolls() || post.user().canSelfEditPolls() && post.user().id() === user.id()) && post.number() === 1) {
      if (!poll.isEnded()) {
        items.add('editPoll', [m(flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a, {
          icon: 'fa fa-check-square',
          className: 'reflar-PollButton',
          onclick: function onclick() {
            app.modal.show(new _components_EditPollModal__WEBPACK_IMPORTED_MODULE_3__["default"]({
              post: post,
              poll: poll
            }));
          }
        }, app.translator.trans('reflar-polls.forum.moderation.edit'))]);
      }

      items.add('removePoll', [m(flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a, {
        icon: 'fa fa-trash',
        className: 'reflar-PollButton',
        onclick: function onclick() {
          if (confirm(app.translator.trans('reflar-polls.forum.moderation.delete_confirm'))) {
            app.request({
              url: app.forum.attribute('apiUrl') + "/reflar/polls/" + poll.id(),
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

/***/ }),

/***/ "./src/forum/PollDiscussion.js":
/*!*************************************!*\
  !*** ./src/forum/PollDiscussion.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_components_CommentPost__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/CommentPost */ "flarum/components/CommentPost");
/* harmony import */ var flarum_components_CommentPost__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_CommentPost__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_PollVote__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/PollVote */ "./src/forum/components/PollVote.js");



/* harmony default export */ __webpack_exports__["default"] = (function () {
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_CommentPost__WEBPACK_IMPORTED_MODULE_1___default.a.prototype, 'content', function (content) {
    var discussion = this.props.post.discussion();

    if (discussion.Poll() && this.props.post.number() === 1 && !this.props.post.isHidden()) {
      this.subtree.invalidate();
      content.push(_components_PollVote__WEBPACK_IMPORTED_MODULE_2__["default"].component({
        poll: discussion.Poll()
      }));
    }
  });
});

/***/ }),

/***/ "./src/forum/addPollBadge.js":
/*!***********************************!*\
  !*** ./src/forum/addPollBadge.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return addPollBadge; });
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/models/Discussion */ "flarum/models/Discussion");
/* harmony import */ var flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_Badge__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/Badge */ "flarum/components/Badge");
/* harmony import */ var flarum_components_Badge__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Badge__WEBPACK_IMPORTED_MODULE_2__);



function addPollBadge() {
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_1___default.a.prototype, 'badges', function (badges) {
    if (this.Poll()) {
      badges.add('poll', flarum_components_Badge__WEBPACK_IMPORTED_MODULE_2___default.a.component({
        type: 'poll',
        label: app.translator.trans('reflar-polls.forum.tooltip.badge'),
        icon: 'fa fa-signal'
      }), 5);
    }
  });
}

/***/ }),

/***/ "./src/forum/components/EditPollModal.js":
/*!***********************************************!*\
  !*** ./src/forum/components/EditPollModal.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return EditPollModal; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_Modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/Modal */ "flarum/components/Modal");
/* harmony import */ var flarum_components_Modal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Modal__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_3__);





var EditPollModal =
/*#__PURE__*/
function (_Modal) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(EditPollModal, _Modal);

  function EditPollModal() {
    return _Modal.apply(this, arguments) || this;
  }

  var _proto = EditPollModal.prototype;

  _proto.init = function init() {
    _Modal.prototype.init.call(this);

    this.answers = this.props.poll.answers();
    this.question = m.prop(this.props.poll.question());
    this.pollCreator = this.props.poll.store.data.users[Object.keys(this.props.poll.store.data.users)[0]];
    this.newAnswer = m.prop('');
    this.endDate = m.prop(this.props.poll.endDate() === ' UTC' ? '' : this.getDateTime(new Date(this.props.poll.endDate())));
  };

  _proto.className = function className() {
    return 'PollDiscussionModal Modal--small';
  };

  _proto.title = function title() {
    return app.translator.trans('reflar-polls.forum.modal.edit_title');
  };

  _proto.getDateTime = function getDateTime(date) {
    if (date === void 0) {
      date = new Date();
    }

    if (isNaN(date)) {
      date = new Date();
    }

    var checkTargets = [date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes()];
    checkTargets.forEach(function (target, i) {
      if (target < 10) {
        checkTargets[i] = "0" + target;
      }
    });
    return date.getFullYear() + '-' + checkTargets[0] + '-' + checkTargets[1] + ' ' + checkTargets[2] + ':' + checkTargets[3];
  };

  _proto.config = function config(isInitalized) {
    var _this = this;

    if (isInitalized) return;
    var oDTP1;
    $('#dtBox').DateTimePicker({
      init: function init() {
        oDTP1 = this;
      },
      dateTimeFormat: "yyyy-MM-dd HH:mm",
      minDateTime: this.getDateTime(),
      settingValueOfElement: function settingValueOfElement(value) {
        _this.endDate(value);

        app.request({
          method: 'PATCH',
          url: app.forum.attribute('apiUrl') + "/reflar/polls/" + _this.props.poll.id() + "/endDate",
          data: {
            date: new Date(value),
            user_id: _this.pollCreator.id()
          }
        });
      }
    });
  };

  _proto.content = function content() {
    var _this2 = this;

    return [m("div", {
      className: "Modal-body"
    }, m("div", {
      className: "PollDiscussionModal-form"
    }, m("div", null, m("fieldset", null, m("input", {
      type: "text",
      name: "question",
      className: "FormControl",
      value: this.question(),
      oninput: m.withAttr('value', this.updateQuestion.bind(this)),
      placeholder: app.translator.trans('reflar-polls.forum.modal.question_placeholder')
    }))), m("h4", null, app.translator.trans('reflar-polls.forum.modal.answers')), this.answers.map(function (answer, i) {
      return m("div", {
        className: "Form-group"
      }, m("fieldset", {
        className: "Poll-answer-input"
      }, m("input", {
        className: "FormControl",
        type: "text",
        oninput: m.withAttr('value', _this2.updateAnswer.bind(_this2, answer)),
        value: answer.answer(),
        placeholder: app.translator.trans('reflar-polls.forum.modal.answer_placeholder') + ' #' + (i + 1)
      })), i + 1 >= 3 ? flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default.a.component({
        type: 'button',
        className: 'Button Button--warning Poll-answer-button',
        icon: 'fa fa-minus',
        onclick: i + 1 >= 3 ? _this2.removeOption.bind(_this2, answer) : ''
      }) : '', m("div", {
        className: "clear"
      }));
    }), m("div", {
      className: "Form-group"
    }, m("fieldset", {
      className: "Poll-answer-input"
    }, m("input", {
      className: "FormControl",
      type: "text",
      oninput: m.withAttr('value', this.newAnswer),
      placeholder: app.translator.trans('reflar-polls.forum.modal.answer_placeholder') + ' #' + (this.answers.length + 1)
    })), flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default.a.component({
      type: 'button',
      className: 'Button Button--warning Poll-answer-button',
      icon: 'fa fa-plus',
      onclick: this.addAnswer.bind(this)
    })), m("div", {
      className: "clear"
    }), m("div", {
      style: "margin-top: 20px",
      className: "Form-group"
    }, m("fieldset", {
      style: "margin-bottom: 15px",
      className: "Poll-answer-input"
    }, m("input", {
      style: "opacity: 1",
      className: "FormControl",
      type: "text",
      "data-field": "datetime",
      value: this.endDate() || app.translator.trans('reflar-polls.forum.modal.date_placeholder'),
      id: "dtInput",
      "data-min": this.getDateTime(),
      readonly: true
    }), m("div", {
      id: "dtBox"
    }))), m("div", {
      className: "clear"
    })), flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default.a.component({
      className: 'Button Button--primary PollModal-SubmitButton',
      children: app.translator.trans('reflar-polls.forum.modal.submit'),
      onclick: function onclick() {
        app.modal.close();
      }
    }))];
  };

  _proto.onhide = function onhide() {
    this.props.poll.answers = m.prop(this.answers);
    this.props.poll.question = this.question;

    if (this.endDate() !== '') {
      this.props.poll.endDate = this.endDate;
    }

    m.redraw.strategy('all');
  };

  _proto.addAnswer = function addAnswer(answer) {
    var _this3 = this;

    var data = {
      answer: this.newAnswer(),
      poll_id: this.props.poll.id(),
      user_id: this.pollCreator.id()
    };

    if (this.answers.length < 10) {
      app.store.createRecord('answers').save(data).then(function (answer) {
        _this3.answers.push(answer);

        _this3.newAnswer('');

        m.redraw.strategy('all');
        m.redraw();
      });
    } else {
      alert(app.translator.trans('reflar-polls.forum.modal.max'));
    }
  };

  _proto.removeOption = function removeOption(option) {
    var _this4 = this;

    app.request({
      method: 'DELETE',
      url: app.forum.attribute('apiUrl') + "/reflar/polls/answers/" + option.data.id,
      data: this.pollCreator.id()
    });
    this.answers.some(function (answer, i) {
      if (answer.data.id === option.data.id) {
        _this4.answers.splice(i, 1);

        return true;
      }
    });
  };

  _proto.updateAnswer = function updateAnswer(answerToUpdate, value) {
    app.request({
      method: 'PATCH',
      url: app.forum.attribute('apiUrl') + "/reflar/polls/answers/" + answerToUpdate.data.id,
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
  };

  _proto.updateQuestion = function updateQuestion(question) {
    if (question === '') {
      alert(app.translator.trans('reflar-polls.forum.modal.include_question'));
      this.question('');
      return;
    }

    app.request({
      method: 'PATCH',
      url: app.forum.attribute('apiUrl') + "/reflar/polls/" + this.props.poll.id(),
      data: {
        question: question,
        user_id: this.pollCreator.id()
      }
    });
    this.question = m.prop(question);
    m.redraw();
  };

  return EditPollModal;
}(flarum_components_Modal__WEBPACK_IMPORTED_MODULE_2___default.a);



/***/ }),

/***/ "./src/forum/components/PollModal.js":
/*!*******************************************!*\
  !*** ./src/forum/components/PollModal.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PollModal; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_Modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/Modal */ "flarum/components/Modal");
/* harmony import */ var flarum_components_Modal__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Modal__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_components_DiscussionComposer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/components/DiscussionComposer */ "flarum/components/DiscussionComposer");
/* harmony import */ var flarum_components_DiscussionComposer__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_components_DiscussionComposer__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_components_Switch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/components/Switch */ "flarum/components/Switch");
/* harmony import */ var flarum_components_Switch__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Switch__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var DateTimePicker__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! DateTimePicker */ "./node_modules/DateTimePicker/dist/DateTimePicker.min.js");
/* harmony import */ var DateTimePicker__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(DateTimePicker__WEBPACK_IMPORTED_MODULE_6__);








var PollModal =
/*#__PURE__*/
function (_Modal) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PollModal, _Modal);

  function PollModal() {
    return _Modal.apply(this, arguments) || this;
  }

  var _proto = PollModal.prototype;

  _proto.init = function init() {
    _Modal.prototype.init.call(this);

    this.answer = [];
    this.question = m.prop('');
    this.answer[0] = m.prop('');
    this.answer[1] = m.prop('');
    this.endDate = m.prop();
    this.publicPoll = m.prop(false);

    if (this.props.poll) {
      var poll = this.props.poll;
      this.answer = Object.values(poll.answers);
      this.question(poll.question);
      this.endDate(isNaN(poll.endDate) ? '' : this.getDateTime(poll.endDate));
      this.publicPoll(poll.publicPoll);
    }
  };

  _proto.className = function className() {
    return 'PollDiscussionModal Modal--small';
  };

  _proto.getDateTime = function getDateTime(date) {
    if (date === void 0) {
      date = new Date();
    }

    if (isNaN(date)) {
      date = new Date();
    }

    var checkTargets = [date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes()];
    checkTargets.forEach(function (target, i) {
      if (target < 10) {
        checkTargets[i] = "0" + target;
      }
    });
    return date.getFullYear() + '-' + checkTargets[0] + '-' + checkTargets[1] + ' ' + checkTargets[2] + ':' + checkTargets[3];
  };

  _proto.title = function title() {
    return app.translator.trans('reflar-polls.forum.modal.add_title');
  };

  _proto.config = function config() {
    var _this = this;

    var oDTP1;
    $('#dtBox').DateTimePicker({
      init: function init() {
        oDTP1 = this;
      },
      dateTimeFormat: "yyyy-MM-dd HH:mm",
      minDateTime: this.getDateTime(),
      settingValueOfElement: function settingValueOfElement(value) {
        _this.endDate(value);
      }
    });
  };

  _proto.content = function content() {
    var _this2 = this;

    return [m("div", {
      className: "Modal-body"
    }, m("div", {
      className: "PollDiscussionModal-form"
    }, m("div", null, m("fieldset", null, m("input", {
      type: "text",
      name: "question",
      className: "FormControl",
      bidi: this.question,
      placeholder: app.translator.trans('reflar-polls.forum.modal.question_placeholder')
    }))), m("h4", null, app.translator.trans('reflar-polls.forum.modal.answers')), Object.keys(this.answer).map(function (el, i) {
      return m("div", {
        className: _this2.answer[i + 1] === '' ? 'Form-group hide' : 'Form-group'
      }, m("fieldset", {
        className: "Poll-answer-input"
      }, m("input", {
        className: "FormControl",
        type: "text",
        name: 'answer' + (i + 1),
        bidi: _this2.answer[i],
        placeholder: app.translator.trans('reflar-polls.forum.modal.answer_placeholder') + ' #' + (i + 1)
      }), m("div", {
        id: "dtBox"
      })), i + 1 >= 3 ? flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default.a.component({
        type: 'button',
        className: 'Button Button--warning Poll-answer-button',
        icon: 'fa fa-minus',
        onclick: i + 1 >= 3 ? _this2.removeOption.bind(_this2, i) : ''
      }) : '', m("div", {
        className: "clear"
      }));
    }), flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default.a.component({
      className: 'Button Button--primary PollModal-Button',
      children: app.translator.trans('reflar-polls.forum.modal.add'),
      onclick: this.addOption.bind(this)
    }), m("div", {
      className: "Form-group"
    }, m("fieldset", {
      style: "margin-bottom: 15px",
      className: "Poll-answer-input"
    }, m("input", {
      style: "opacity: 1; color: inherit",
      className: "FormControl",
      type: "text",
      "data-field": "datetime",
      value: this.endDate() || app.translator.trans('reflar-polls.forum.modal.date_placeholder'),
      id: "dtInput",
      "data-min": this.getDateTime(),
      readonly: true
    })), m("div", {
      className: "clear"
    }), flarum_components_Switch__WEBPACK_IMPORTED_MODULE_5___default.a.component({
      state: this.publicPoll() || false,
      children: app.translator.trans('reflar-polls.forum.modal.switch'),
      onchange: this.publicPoll
    }), m("div", {
      className: "clear"
    }), flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default.a.component({
      type: 'submit',
      className: 'Button Button--primary PollModal-SubmitButton',
      children: app.translator.trans('reflar-polls.forum.modal.submit')
    }))))];
  };

  _proto.addOption = function addOption() {
    if (this.answer.length < 11) {
      this.answer.push(m.prop(''));
    } else {
      alert(app.translator.trans('reflar-polls.forum.modal.max'));
    }
  };

  _proto.removeOption = function removeOption(option) {
    var _this3 = this;

    this.answer.forEach(function (answer, i) {
      if (i === option) {
        _this3.answer.splice(i, 1);
      }
    });
  };

  _proto.objectSize = function objectSize(obj) {
    var size = 0,
        key;

    for (key in obj) {
      if (obj[key] !== '') size++;
    }

    return size;
  };

  _proto.onsubmit = function onsubmit(e) {
    e.preventDefault();
    var pollArray = {
      question: this.question(),
      answers: {},
      endDate: new Date(this.endDate()),
      publicPoll: this.publicPoll()
    };

    if (this.question() === '') {
      alert(app.translator.trans('reflar-polls.forum.modal.include_question'));
      return;
    } // Add answers to PollArray


    this.answer.map(function (answer, i) {
      if (answer() !== '') {
        pollArray['answers'][i] = answer;
      }
    });

    if (this.objectSize(pollArray.answers) < 2) {
      alert(app.translator.trans('reflar-polls.forum.modal.min'));
      return;
    } // Add data to DiscussionComposer post data


    Object(flarum_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_components_DiscussionComposer__WEBPACK_IMPORTED_MODULE_4___default.a.prototype, 'data', function (data) {
      data.poll = pollArray;
    });
    app.modal.close();
    m.redraw.strategy('none');
  };

  return PollModal;
}(flarum_components_Modal__WEBPACK_IMPORTED_MODULE_2___default.a);



/***/ }),

/***/ "./src/forum/components/PollVote.js":
/*!******************************************!*\
  !*** ./src/forum/components/PollVote.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PollVote; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/Component */ "flarum/Component");
/* harmony import */ var flarum_Component__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_Component__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_components_LogInModal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/components/LogInModal */ "flarum/components/LogInModal");
/* harmony import */ var flarum_components_LogInModal__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_components_LogInModal__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _ShowVotersModal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ShowVotersModal */ "./src/forum/components/ShowVotersModal.js");







var PollVote =
/*#__PURE__*/
function (_Component) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(PollVote, _Component);

  function PollVote() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = PollVote.prototype;

  _proto.init = function init() {
    var _this = this;

    this.poll = this.props.poll;
    this.votes = this.poll.votes();
    this.voted = m.prop(false);
    this.user = app.session.user;
    this.answers = [];
    this.poll.answers().forEach(function (answer) {
      _this.answers[answer.id()] = answer;
    });

    if (this.user !== undefined) {
      if (!this.user.canVote()) {
        this.voted(true);
      } else {
        app.store.find('reflar/polls/votes', {
          poll_id: this.poll.id(),
          user_id: this.user.id()
        }).then(function (data) {
          if (data[0] !== undefined) {
            _this.voted(data[0]);
          } else if (_this.poll.isEnded()) {
            _this.voted(true);
          }

          m.redraw();
        });
      }
    }
  };

  _proto.showVoters = function showVoters() {
    app.modal.show(new _ShowVotersModal__WEBPACK_IMPORTED_MODULE_5__["default"](this.poll));
  };

  _proto.onError = function onError(el, error) {
    el.srcElement.checked = false;
    app.alerts.show(error.alert);
  };

  _proto.changeVote = function changeVote(answer, el) {
    var _this2 = this;

    var oldVoteId = this.voted().id();
    var oldAnswerId = this.voted().option_id();
    app.request({
      method: 'PATCH',
      url: app.forum.attribute('apiUrl') + "/reflar/polls/votes/" + answer.id(),
      errorHandler: this.onError.bind(this, el),
      data: {
        option_id: answer.id(),
        poll_id: this.poll.id()
      }
    }).then(function (response) {
      _this2.answers[answer.id()].data.attributes.votes++;
      _this2.answers[oldAnswerId].data.attributes.votes--;

      _this2.votes.some(function (vote, i) {
        if (vote.data.id === oldVoteId) {
          _this2.votes[i].data.attributes.option_id = response.data.attributes.option_id;
        }
      });

      _this2.poll.data.relationships.votes.data.some(function (vote) {
        if (typeof vote.id === "function") {
          var id = vote.id();
        } else {
          var id = vote.id;
        }

        if (oldVoteId === parseInt(id)) {
          vote.option_id = m.prop(response.data.attributes.option_id);
          return true;
        }
      });

      _this2.poll.votes = m.prop(_this2.votes);
      m.redraw.strategy('all');
      m.redraw();
    });
  };

  _proto.view = function view() {
    var _this3 = this;

    if (this.voted() !== false) {
      return m("div", null, m("h3", null, this.poll.question()), this.answers.map(function (item) {
        var voted = false;

        if (_this3.voted() !== true) {
          voted = parseInt(_this3.voted().option_id()) === item.data.attributes.id;
          m.redraw();
        }

        var percent = Math.round(item.votes() / _this3.poll.votes().length * 100);
        return m("div", {
          className: "PollOption PollVoted"
        }, m("div", {
          title: item.votes() >= 1 ? item.votes() + ' ' + app.translator.trans('reflar-polls.forum.tooltip.vote') : item.votes() + ' ' + app.translator.trans('reflar-polls.forum.tooltip.votes'),
          className: "PollBar",
          "data-selected": voted,
          config: function config(element) {
            $(element).tooltip({
              placement: 'right'
            });
          }
        }, !_this3.poll.isEnded() && _this3.voted !== true ? m("label", {
          className: "checkbox"
        }, voted ? m("input", {
          onchange: _this3.changeVote.bind(_this3, item),
          type: "checkbox",
          checked: true
        }) : m("input", {
          onchange: _this3.changeVote.bind(_this3, item),
          type: "checkbox"
        }), m("span", {
          className: "checkmark"
        })) : '', m("div", {
          style: '--width: ' + percent + '%',
          className: "PollOption-active"
        }), m("label", {
          style: !_this3.poll.isEnded() ? "margin-left: 25px" : '',
          className: "PollAnswer"
        }, m("span", null, item.answer())), m("label", null, m("span", {
          className: percent !== 100 ? 'PollPercent PollPercent--option' : 'PollPercent'
        }, percent, "%"))));
      }), m("div", {
        className: "clear"
      }), this.poll.isPublic() ? flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
        className: 'Button Button--primary PublicPollButton',
        children: app.translator.trans('reflar-polls.forum.public_poll'),
        onclick: function onclick() {
          app.modal.show(new _ShowVotersModal__WEBPACK_IMPORTED_MODULE_5__["default"]({
            votes: _this3.votes,
            answers: _this3.answers
          }));
        }
      }) : '', m("div", {
        className: "clear"
      }), !this.user.canVote() ? m("div", {
        className: "helpText PollInfoText"
      }, app.translator.trans('reflar-polls.forum.no_permission')) : this.poll.isEnded() ? m("div", {
        className: "helpText PollInfoText"
      }, app.translator.trans('reflar-polls.forum.poll_ended')) : !isNaN(new Date(this.poll.endDate())) ? m("div", {
        className: "helpText PollInfoText"
      }, m("i", {
        class: "icon fa fa-clock-o"
      }), " ", app.translator.trans('reflar-polls.forum.days_remaining', {
        time: moment(this.poll.endDate()).fromNow()
      })) : '', m("div", {
        className: "clear"
      }));
    } else {
      return m("div", null, m("h3", null, this.poll.question()), this.answers.map(function (item) {
        return m("div", {
          className: "PollOption"
        }, m("div", {
          className: "PollBar"
        }, m("label", {
          className: "checkbox"
        }, m("input", {
          type: "checkbox",
          onchange: _this3.addVote.bind(_this3, item)
        }), m("span", null, item.answer()), m("span", {
          className: "checkmark"
        }))));
      }), m("div", {
        className: "clear"
      }), this.poll.isPublic() && app.session.user !== undefined ? flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
        className: 'Button Button--primary PublicPollButton',
        children: app.translator.trans('reflar-polls.forum.public_poll'),
        onclick: function onclick() {
          app.modal.show(new _ShowVotersModal__WEBPACK_IMPORTED_MODULE_5__["default"](_this3.poll));
        }
      }) : '', this.poll.isEnded() ? m("div", {
        className: "helpText PollInfoText"
      }, app.translator.trans('reflar-polls.forum.poll_ended')) : !isNaN(new Date(this.poll.endDate())) ? m("div", {
        className: "helpText PollInfoText"
      }, m("i", {
        class: "icon fa fa-clock-o"
      }), " ", app.translator.trans('reflar-polls.forum.days_remaining', {
        time: moment(this.poll.endDate()).fromNow()
      })) : '');
    }
  };

  _proto.addVote = function addVote(answer, el) {
    var _this4 = this;

    if (this.user === undefined) {
      app.modal.show(new flarum_components_LogInModal__WEBPACK_IMPORTED_MODULE_4___default.a());
      el.srcElement.checked = false;
    } else {
      app.store.createRecord('votes').save({
        poll_id: this.poll.id(),
        option_id: answer.id()
      }).then(function (vote) {
        _this4.answers[answer.id()].data.attributes.votes++;

        _this4.voted(vote);

        _this4.poll.data.relationships.votes.data.push(vote);

        _this4.votes.push(vote);

        m.redraw();
      });
    }
  };

  return PollVote;
}(flarum_Component__WEBPACK_IMPORTED_MODULE_3___default.a);



/***/ }),

/***/ "./src/forum/components/ShowVotersModal.js":
/*!*************************************************!*\
  !*** ./src/forum/components/ShowVotersModal.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ShowVotersModal; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_components_Modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/Modal */ "flarum/components/Modal");
/* harmony import */ var flarum_components_Modal__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Modal__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/utils/ItemList */ "flarum/utils/ItemList");
/* harmony import */ var flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/helpers/avatar */ "flarum/helpers/avatar");
/* harmony import */ var flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_helpers_username__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/helpers/username */ "flarum/helpers/username");
/* harmony import */ var flarum_helpers_username__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_username__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/helpers/listItems */ "flarum/helpers/listItems");
/* harmony import */ var flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_5__);







var ShowVotersModal =
/*#__PURE__*/
function (_Modal) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(ShowVotersModal, _Modal);

  function ShowVotersModal() {
    return _Modal.apply(this, arguments) || this;
  }

  var _proto = ShowVotersModal.prototype;

  _proto.className = function className() {
    return 'Modal--small';
  };

  _proto.title = function title() {
    return app.translator.trans('reflar-polls.forum.votes_modal.title');
  };

  _proto.getUsers = function getUsers(answer) {
    var votes = [];

    if (typeof this.props.votes === 'function') {
      votes = this.props.votes();
    } else {
      votes = this.props.votes;
    }

    var items = new flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_2___default.a();
    var counter = 0;
    votes.map(function (vote) {
      var user = app.store.getById('users', vote.data.attributes.user_id);

      if (parseInt(answer.id()) === parseInt(vote.data.attributes.option_id)) {
        counter++;
        items.add(user.id(), m("a", {
          href: app.route.user(user),
          config: m.route
        }, flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_3___default()(user), " ", ' ', flarum_helpers_username__WEBPACK_IMPORTED_MODULE_4___default()(user)));
      }
    });

    if (counter === 0) {
      items.add('none', m("h4", {
        style: "color: #000"
      }, app.translator.trans('reflar-polls.forum.modal.no_voters')));
    }

    return items;
  };

  _proto.content = function content() {
    var _this = this;

    if (typeof this.props.answers === 'function') {
      this.answers = this.props.answers();
    } else {
      this.answers = this.props.answers;
    }

    return m("div", {
      className: "Modal-body"
    }, m("ul", {
      className: "VotesModal-list"
    }, this.answers.map(function (answer) {
      return m("div", null, m("h2", null, answer.answer() + ':'), flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_5___default()(_this.getUsers(answer).toArray()));
    })));
  };

  return ShowVotersModal;
}(flarum_components_Modal__WEBPACK_IMPORTED_MODULE_1___default.a);



/***/ }),

/***/ "./src/forum/index.js":
/*!****************************!*\
  !*** ./src/forum/index.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_DiscussionComposer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/DiscussionComposer */ "flarum/components/DiscussionComposer");
/* harmony import */ var flarum_components_DiscussionComposer__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_DiscussionComposer__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/Model */ "flarum/Model");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_Model__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _common_models_Question__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/models/Question */ "./src/common/models/Question.js");
/* harmony import */ var _common_models_Answer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/models/Answer */ "./src/common/models/Answer.js");
/* harmony import */ var _common_models_Vote__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/models/Vote */ "./src/common/models/Vote.js");
/* harmony import */ var flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/models/Discussion */ "flarum/models/Discussion");
/* harmony import */ var flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_models_User__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/models/User */ "flarum/models/User");
/* harmony import */ var flarum_models_User__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_models_User__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _addPollBadge__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./addPollBadge */ "./src/forum/addPollBadge.js");
/* harmony import */ var _PollControl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./PollControl */ "./src/forum/PollControl.js");
/* harmony import */ var _PollDiscussion__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./PollDiscussion */ "./src/forum/PollDiscussion.js");
/* harmony import */ var _components_PollModal__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/PollModal */ "./src/forum/components/PollModal.js");













flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.initializers.add('reflar-polls', function (app) {
  // Relationships
  app.store.models.answers = _common_models_Answer__WEBPACK_IMPORTED_MODULE_5__["default"];
  app.store.models.questions = _common_models_Question__WEBPACK_IMPORTED_MODULE_4__["default"];
  app.store.models.votes = _common_models_Vote__WEBPACK_IMPORTED_MODULE_6__["default"];
  flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_7___default.a.prototype.Poll = flarum_Model__WEBPACK_IMPORTED_MODULE_3___default.a.hasOne('Poll');
  flarum_models_User__WEBPACK_IMPORTED_MODULE_8___default.a.prototype.canEditPolls = flarum_Model__WEBPACK_IMPORTED_MODULE_3___default.a.attribute('canEditPolls');
  flarum_models_User__WEBPACK_IMPORTED_MODULE_8___default.a.prototype.canStartPolls = flarum_Model__WEBPACK_IMPORTED_MODULE_3___default.a.attribute('canStartPolls');
  flarum_models_User__WEBPACK_IMPORTED_MODULE_8___default.a.prototype.canSelfEditPolls = flarum_Model__WEBPACK_IMPORTED_MODULE_3___default.a.attribute('canSelfEditPolls');
  flarum_models_User__WEBPACK_IMPORTED_MODULE_8___default.a.prototype.canVote = flarum_Model__WEBPACK_IMPORTED_MODULE_3___default.a.attribute('canVote');

  flarum_components_DiscussionComposer__WEBPACK_IMPORTED_MODULE_2___default.a.prototype.addPoll = function (data) {
    app.modal.show(new _components_PollModal__WEBPACK_IMPORTED_MODULE_12__["default"](data));
  }; // Add button to DiscussionComposer header


  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_components_DiscussionComposer__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'headerItems', function (items) {
    if (app.session.user.canStartPolls()) {
      items.add('polls', m("a", {
        className: "DiscussionComposer-poll",
        onclick: this.addPoll.bind(this, this.data())
      }, this.data().poll ? m("span", {
        className: "PollLabel"
      }, app.translator.trans('reflar-polls.forum.composer_discussion.edit')) : m("span", {
        className: "PollLabel"
      }, app.translator.trans('reflar-polls.forum.composer_discussion.add_poll'))), 1);
    }
  });
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_components_DiscussionComposer__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'onsubmit', function () {
    Object(flarum_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_components_DiscussionComposer__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'data', function (data) {
      data.poll = undefined;
    });
  });
  Object(_addPollBadge__WEBPACK_IMPORTED_MODULE_9__["default"])();
  Object(_PollDiscussion__WEBPACK_IMPORTED_MODULE_11__["default"])();
  Object(_PollControl__WEBPACK_IMPORTED_MODULE_10__["default"])();
});

/***/ }),

/***/ "flarum/Component":
/*!**************************************************!*\
  !*** external "flarum.core.compat['Component']" ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['Component'];

/***/ }),

/***/ "flarum/Model":
/*!**********************************************!*\
  !*** external "flarum.core.compat['Model']" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['Model'];

/***/ }),

/***/ "flarum/app":
/*!********************************************!*\
  !*** external "flarum.core.compat['app']" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['app'];

/***/ }),

/***/ "flarum/components/Badge":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['components/Badge']" ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Badge'];

/***/ }),

/***/ "flarum/components/Button":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['components/Button']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Button'];

/***/ }),

/***/ "flarum/components/CommentPost":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['components/CommentPost']" ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/CommentPost'];

/***/ }),

/***/ "flarum/components/DiscussionComposer":
/*!**********************************************************************!*\
  !*** external "flarum.core.compat['components/DiscussionComposer']" ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/DiscussionComposer'];

/***/ }),

/***/ "flarum/components/LogInModal":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['components/LogInModal']" ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/LogInModal'];

/***/ }),

/***/ "flarum/components/Modal":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['components/Modal']" ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Modal'];

/***/ }),

/***/ "flarum/components/Switch":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['components/Switch']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Switch'];

/***/ }),

/***/ "flarum/extend":
/*!***********************************************!*\
  !*** external "flarum.core.compat['extend']" ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['extend'];

/***/ }),

/***/ "flarum/helpers/avatar":
/*!*******************************************************!*\
  !*** external "flarum.core.compat['helpers/avatar']" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['helpers/avatar'];

/***/ }),

/***/ "flarum/helpers/listItems":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['helpers/listItems']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['helpers/listItems'];

/***/ }),

/***/ "flarum/helpers/username":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['helpers/username']" ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['helpers/username'];

/***/ }),

/***/ "flarum/models/Discussion":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['models/Discussion']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['models/Discussion'];

/***/ }),

/***/ "flarum/models/User":
/*!****************************************************!*\
  !*** external "flarum.core.compat['models/User']" ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['models/User'];

/***/ }),

/***/ "flarum/utils/ItemList":
/*!*******************************************************!*\
  !*** external "flarum.core.compat['utils/ItemList']" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/ItemList'];

/***/ }),

/***/ "flarum/utils/PostControls":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['utils/PostControls']" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/PostControls'];

/***/ }),

/***/ "flarum/utils/mixin":
/*!****************************************************!*\
  !*** external "flarum.core.compat['utils/mixin']" ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/mixin'];

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ })

/******/ });
//# sourceMappingURL=forum.js.map