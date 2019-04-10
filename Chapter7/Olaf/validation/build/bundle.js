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
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./IO.js":
/*!***************!*\
  !*** ./IO.js ***!
  \***************/
/*! exports provided: IO */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"IO\", function() { return IO; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar IO =\n/*#__PURE__*/\nfunction () {\n  function IO(effect) {\n    _classCallCheck(this, IO);\n\n    this.effect = effect;\n  }\n\n  _createClass(IO, [{\n    key: \"map\",\n    value: function map(mapper) {\n      var _this = this;\n\n      return new IO(function () {\n        return mapper(_this.effect());\n      });\n    }\n  }, {\n    key: \"flatMap\",\n    value: function flatMap(mapper) {\n      return mapper(this.effect());\n    }\n  }, {\n    key: \"run\",\n    value: function run() {\n      this.effect();\n    }\n  }], [{\n    key: \"from\",\n    value: function from(effect) {\n      return new IO(effect);\n    }\n  }]);\n\n  return IO;\n}();\n\n//# sourceURL=webpack:///./IO.js?");

/***/ }),

/***/ "./Maybe.js":
/*!******************!*\
  !*** ./Maybe.js ***!
  \******************/
/*! exports provided: Maybe, Just, Nothing */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Maybe\", function() { return Maybe; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Just\", function() { return Just; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Nothing\", function() { return Nothing; });\n/* harmony import */ var _Validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Validation */ \"./Validation.js\");\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\nvar Maybe =\n/*#__PURE__*/\nfunction () {\n  function Maybe() {\n    _classCallCheck(this, Maybe);\n  }\n\n  _createClass(Maybe, null, [{\n    key: \"of\",\n    value: function of(value) {\n      return value !== undefined && value !== null ? new Just(value) : new Nothing();\n    }\n  }]);\n\n  return Maybe;\n}();\nvar Just =\n/*#__PURE__*/\nfunction (_Maybe) {\n  _inherits(Just, _Maybe);\n\n  function Just(value) {\n    var _this;\n\n    _classCallCheck(this, Just);\n\n    _this = _possibleConstructorReturn(this, _getPrototypeOf(Just).call(this));\n    _this._value = value;\n    return _this;\n  }\n\n  _createClass(Just, [{\n    key: \"map\",\n    value: function map(mapper) {\n      return Maybe.of(mapper(this._value));\n    }\n  }, {\n    key: \"flatMap\",\n    value: function flatMap(mapper) {\n      return mapper(this._value);\n    }\n  }, {\n    key: \"toValidation\",\n    value: function toValidation() {\n      return _Validation__WEBPACK_IMPORTED_MODULE_0__[\"Validation\"].success(this._value);\n    }\n  }]);\n\n  return Just;\n}(Maybe);\nvar Nothing =\n/*#__PURE__*/\nfunction (_Maybe2) {\n  _inherits(Nothing, _Maybe2);\n\n  function Nothing() {\n    _classCallCheck(this, Nothing);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(Nothing).apply(this, arguments));\n  }\n\n  _createClass(Nothing, [{\n    key: \"map\",\n    value: function map() {\n      return this;\n    }\n  }, {\n    key: \"flatMap\",\n    value: function flatMap() {\n      return null;\n    }\n  }, {\n    key: \"toValidation\",\n    value: function toValidation(failValue) {\n      return _Validation__WEBPACK_IMPORTED_MODULE_0__[\"Validation\"].fail(failValue);\n    }\n  }]);\n\n  return Nothing;\n}(Maybe);\n\n//# sourceURL=webpack:///./Maybe.js?");

/***/ }),

/***/ "./Validation.js":
/*!***********************!*\
  !*** ./Validation.js ***!
  \***********************/
/*! exports provided: Validation, Fail, Success */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Validation\", function() { return Validation; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Fail\", function() { return Fail; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Success\", function() { return Success; });\nfunction _typeof(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === \"object\" || typeof call === \"function\")) { return call; } return _assertThisInitialized(self); }\n\nfunction _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return self; }\n\nfunction _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function\"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }\n\nfunction _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar Validation =\n/*#__PURE__*/\nfunction () {\n  function Validation(value) {\n    _classCallCheck(this, Validation);\n\n    this._value = value;\n  }\n\n  _createClass(Validation, null, [{\n    key: \"of\",\n    value: function of(value) {\n      return new Success(value);\n    }\n  }, {\n    key: \"success\",\n    value: function success(value) {\n      return new Success(value);\n    }\n  }, {\n    key: \"fail\",\n    value: function fail(value) {\n      return new Fail(value);\n    }\n  }]);\n\n  return Validation;\n}();\nvar Fail =\n/*#__PURE__*/\nfunction (_Validation) {\n  _inherits(Fail, _Validation);\n\n  function Fail() {\n    _classCallCheck(this, Fail);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(Fail).apply(this, arguments));\n  }\n\n  _createClass(Fail, [{\n    key: \"map\",\n    value: function map() {\n      return this;\n    }\n  }, {\n    key: \"invalidMap\",\n    value: function invalidMap(mapper) {\n      return mapper(this._value);\n    }\n  }, {\n    key: \"flatMap\",\n    value: function flatMap() {\n      return this._value;\n    }\n  }, {\n    key: \"validate\",\n    value: function validate() {\n      return this;\n    }\n  }, {\n    key: \"getOr\",\n    value: function getOr(fn) {\n      return fn(this._value);\n    }\n  }]);\n\n  return Fail;\n}(Validation);\nvar Success =\n/*#__PURE__*/\nfunction (_Validation2) {\n  _inherits(Success, _Validation2);\n\n  function Success() {\n    _classCallCheck(this, Success);\n\n    return _possibleConstructorReturn(this, _getPrototypeOf(Success).apply(this, arguments));\n  }\n\n  _createClass(Success, [{\n    key: \"map\",\n    value: function map(mapper) {\n      return Validation.of(mapper(this._value));\n    }\n  }, {\n    key: \"invalidMap\",\n    value: function invalidMap() {\n      return this;\n    }\n  }, {\n    key: \"flatMap\",\n    value: function flatMap(mapper) {\n      return mapper(this._value);\n    }\n  }, {\n    key: \"validate\",\n    value: function validate(predicate, message) {\n      return predicate(this._value) ? new Success(this._value) : new Fail(message);\n    }\n  }, {\n    key: \"getOr\",\n    value: function getOr() {\n      return this._value;\n    }\n  }]);\n\n  return Success;\n}(Validation);\n\n//# sourceURL=webpack:///./Validation.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Validation */ \"./Validation.js\");\n/* harmony import */ var _IO__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./IO */ \"./IO.js\");\n/* harmony import */ var _Maybe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Maybe */ \"./Maybe.js\");\n\n\n\nvar form = document.getElementById('form');\n\nfunction not(fn) {\n  return function (value) {\n    return !fn(value);\n  };\n}\n\nfunction isEmpty(value) {\n  return value === undefined || value === null || value === '';\n}\n\nfunction isTooShort(length) {\n  return function (value) {\n    return value.length < length;\n  };\n}\n\nfunction isTooLong(length) {\n  return function (value) {\n    return value.length > length;\n  };\n}\n\nform.addEventListener('submit', function (event) {\n  event.preventDefault();\n  _IO__WEBPACK_IMPORTED_MODULE_1__[\"IO\"].from(function () {\n    return document.querySelector('[name=\"name\"]');\n  }).flatMap(function (v) {\n    return _Maybe__WEBPACK_IMPORTED_MODULE_2__[\"Maybe\"].of(v);\n  }).map(function (v) {\n    return v.value;\n  }).toValidation('해당하는 Element를 발견하지 못했습니다.').validate(not(isEmpty), '이름을 입력해주세요.').validate(not(isTooShort(2)), '이름이 너무 짧아요.').validate(not(isTooLong(10)), '이름이 너무 길어요.').getOr(console.error);\n  _IO__WEBPACK_IMPORTED_MODULE_1__[\"IO\"].from(function () {\n    return document.querySelector('[name=\"phone\"]');\n  }).flatMap(function (v) {\n    return _Maybe__WEBPACK_IMPORTED_MODULE_2__[\"Maybe\"].of(v);\n  }).map(function (v) {\n    return v.value;\n  }).toValidation('해당하는 Element를 발견하지 못했습니다.').validate(not(isEmpty), '전화번호를 입력해주세요.').validate(not(isTooShort(9)), '전화번호가 너무 짧아요.').validate(not(isTooLong(12)), '전화번호가 너무 길어요.').getOr(console.error);\n});\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

/******/ });