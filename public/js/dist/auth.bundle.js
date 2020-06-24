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
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/js/auth.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/js/auth.js":
/*!***************************!*\
  !*** ./public/js/auth.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helpers_validator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/validator */ \"./public/js/helpers/validator.js\");\n/* harmony import */ var _helpers_server_feedback__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers/server-feedback */ \"./public/js/helpers/server-feedback.js\");\n\r\n\r\n\r\nconst spinner = document.querySelector('#spinner');\r\nconst feedbackElem = document.querySelector('#serverFeedback');\r\n\r\nwindow.onload = function() {\r\n    const loginForm = document.querySelector('#login-form');\r\n    const registrationForm = document.querySelector('#registration-form');\r\n    if (loginForm) {\r\n        loginForm.addEventListener('submit', submitLogin);\r\n        Object(_helpers_validator__WEBPACK_IMPORTED_MODULE_0__[\"setValidateListeners\"])(loginForm);\r\n    }\r\n    if (registrationForm) {\r\n        registrationForm.addEventListener('submit', submitRegistration);\r\n        Object(_helpers_validator__WEBPACK_IMPORTED_MODULE_0__[\"setValidateListeners\"])(registrationForm);\r\n    }\r\n}\r\n\r\nasync function submitLogin(e){\r\n    e.preventDefault();\r\n    const error = Object(_helpers_validator__WEBPACK_IMPORTED_MODULE_0__[\"validate\"])(this);\r\n    if (error) return;\r\n    const login = document.getElementById('authLogin').value;\r\n    const password = document.getElementById('authPassword').value;\r\n    const setSession = document.getElementById('authRememberMe').checked;\r\n    const formData = {login, password, setSession};\r\n    await sendResponse('/auth/login', '/', formData);\r\n}\r\nasync function submitRegistration(e) {\r\n    e.preventDefault();\r\n    const error = Object(_helpers_validator__WEBPACK_IMPORTED_MODULE_0__[\"validate\"])(this);\r\n    if (error) return;\r\n    const login = document.getElementById('regLogin').value;\r\n    const email = document.getElementById('regEmail').value;\r\n    const password = document.getElementById('regPassword').value;\r\n    const confirmPassword = document.getElementById('regConfirmPassword').value;\r\n    const formData = {login, email, password, confirmPassword};\r\n    await sendResponse('/auth/registration', '/auth/login', formData);\r\n}\r\n\r\nasync function sendResponse(url, redirectUrl, formData) {\r\n    try {\r\n        spinner.hidden = false;\r\n        const response = await fetch(url, {\r\n            method: 'POST',\r\n            credentials: 'same-origin',\r\n            headers: {\r\n                'Content-Type': 'application/json'\r\n            },\r\n            body: JSON.stringify(formData)\r\n        });\r\n        const data = await response.json();\r\n        Object(_helpers_server_feedback__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(feedbackElem, data);\r\n        if (data.ok) {\r\n            setTimeout(() => {\r\n                window.location.href = redirectUrl;\r\n            }, 500);\r\n        }\r\n    } catch (err) {\r\n        Object(_helpers_server_feedback__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(feedbackElem,{ ok: false, caption: err });\r\n    } finally {\r\n        setTimeout(() => {\r\n            spinner.hidden = true;\r\n        }, 500)\r\n    }\r\n}\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./public/js/auth.js?");

/***/ }),

/***/ "./public/js/helpers/server-feedback.js":
/*!**********************************************!*\
  !*** ./public/js/helpers/server-feedback.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return setServerFeedback; });\nfunction setServerFeedback(elem, data, time = 4000) {\r\n    // const serverFeedback = document.querySelector('#serverFeedback');\r\n    elem.classList.remove('alert-success', 'alert-danger');\r\n    elem.classList.add(data.ok ? 'alert-success' : 'alert-danger');\r\n    elem.hidden = false;\r\n    elem.innerText = data.caption;\r\n    setTimeout(() => {\r\n        elem.hidden = true;\r\n    }, time);\r\n}\r\n\n\n//# sourceURL=webpack:///./public/js/helpers/server-feedback.js?");

/***/ }),

/***/ "./public/js/helpers/validator.js":
/*!****************************************!*\
  !*** ./public/js/helpers/validator.js ***!
  \****************************************/
/*! exports provided: validate, setValidateListeners */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"validate\", function() { return validate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setValidateListeners\", function() { return setValidateListeners; });\nfunction validate(form) {\r\n    const formControls = Array.from(form.querySelectorAll('.form-control'));\r\n    let hasError = false;\r\n    for (let i = 0; i < formControls.length; i++) {\r\n        const feedback = formControls[i].closest('.form-group').querySelector('.invalid-feedback');\r\n        removeFeedback(formControls[i], feedback);\r\n        const error = validateInput(formControls[i], form);\r\n        if (error) {\r\n            setFeedback(formControls[i], feedback, error);\r\n            hasError = true;\r\n        }\r\n    }\r\n    if(hasError) return true;\r\n}\r\n\r\nfunction setValidateListeners(form) {\r\n    const formControls = Array.from(form.querySelectorAll('.form-control'));\r\n    const btn = form.querySelector('button');\r\n    formControls.forEach(input => {\r\n        const feedback = input.closest('.form-group').querySelector('.invalid-feedback');\r\n        input.addEventListener('blur', function () {\r\n            const error = validateInput(input, form);\r\n            if (error) setFeedback(input, feedback, error);\r\n        });\r\n        input.addEventListener('input', removeFeedback.bind(this, input, feedback));\r\n    })\r\n}\r\n\r\nfunction checkInputIsEmpty(input) {\r\n    if (!input.value) {\r\n        return 'Поле обязательное для заполнения';\r\n    }\r\n}\r\nfunction checkLength(input, mixValue) {\r\n    if (input.value.length < mixValue) {\r\n        return `Поле должно содержать больше ${mixValue-1}-х символов`;\r\n    }\r\n}\r\nfunction matchPasswords(password, confirmPassword) {\r\n    if (password.value !== confirmPassword.value) {\r\n        return 'Пароли не совпадают';\r\n    }\r\n}\r\nfunction checkPattern(input, pattern) {\r\n    const regExp = new RegExp(pattern, 'gi');\r\n    if (!regExp.test(input.value)) {\r\n        return 'Неверный формат данных';\r\n    }\r\n}\r\n\r\nfunction validateInput(input) {\r\n    const inputData = input.dataset;\r\n    let error;\r\n    if(input.hasAttribute('required')) {\r\n        error = checkInputIsEmpty(input);\r\n        if (error) return error;\r\n    }\r\n    if(inputData.min) {\r\n        error = checkLength(input, inputData.min);\r\n        if (error) return error;\r\n    }\r\n    if (inputData.pattern) {\r\n        error = checkPattern(input, inputData.pattern);\r\n        if (error) return error;\r\n    }\r\n    if(inputData.comparewith) {\r\n        let password = document.getElementById(inputData.comparewith);\r\n        error = matchPasswords(password, input);\r\n        if (error) return error;\r\n    }\r\n    return false;\r\n}\r\n\r\nfunction setFeedback(input, feedback, feedbackText) {\r\n    input.classList.add('is-invalid');\r\n    feedback.style.display = 'block';\r\n    feedback.innerText = feedbackText;\r\n}\r\nfunction removeFeedback(input, feedback) {\r\n    input.classList.remove('is-invalid');\r\n    feedback.style.display = 'none';\r\n}\r\n\n\n//# sourceURL=webpack:///./public/js/helpers/validator.js?");

/***/ })

/******/ });