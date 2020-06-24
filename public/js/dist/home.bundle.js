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
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/js/home.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/js/entities/country-entity.js":
/*!**********************************************!*\
  !*** ./public/js/entities/country-entity.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Country; });\nclass Country {\r\n    constructor(code) {\r\n        this.data = '';\r\n        this.code = code;\r\n    }\r\n    async loadData(additionalFields) {\r\n        const requestBody = {\r\n            searchField: 'isoAlpha3',\r\n            value: this.code\r\n        }\r\n        try {\r\n            const response = await fetch('/api/getCountry', {\r\n                method: 'POST',\r\n                credentials: 'same-origin',\r\n                headers: {'Content-Type': 'application/json'},\r\n                body: JSON.stringify(requestBody)\r\n            });\r\n            if (response.redirected) {\r\n                window.location.href = response.url;\r\n                return;\r\n            }\r\n            const data = await response.json(); // api geonames object\r\n            if (!data.ok) {\r\n                throw new Error(data.caption);\r\n            }\r\n            this.data = data.foundCountry; // api rest countries object\r\n            await this.loadAdditionalData(additionalFields);\r\n        } catch (err) {\r\n            throw err;\r\n        }\r\n    }\r\n    async loadAdditionalData(fieldsArray) {\r\n        const joinedFields = fieldsArray.join(';');\r\n        const response = await fetch(`https://restcountries.eu/rest/v2/alpha/${this.code}?fields=${joinedFields}`);\r\n        if (response.status === 404) {\r\n            throw new Error('Не удалось загрузить дополнительную информацию (карту и языки)');\r\n        }\r\n        this.data.additional = await response.json();\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./public/js/entities/country-entity.js?");

/***/ }),

/***/ "./public/js/entities/vacation-entity.js":
/*!***********************************************!*\
  !*** ./public/js/entities/vacation-entity.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Vacation; });\n/* harmony import */ var _country_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./country-entity */ \"./public/js/entities/country-entity.js\");\n\r\n\r\nclass Vacation {\r\n    constructor(vacation) {\r\n        this.id = vacation.id;\r\n        this.countryName = vacation.countryName;\r\n        this.countryCode = vacation.countryCode;\r\n        this.dateFrom = new Date(vacation.dateFrom).toLocaleDateString();\r\n        this.dateTo = new Date(vacation.dateTo).toLocaleDateString();\r\n        this.status = Vacation.calculateStatus(vacation.dateFrom, vacation.dateTo);\r\n    }\r\n    \r\n    static calculateStatus(dateFrom, dateTo) {\r\n        dateFrom = new Date(dateFrom);\r\n        dateTo = new Date(dateTo);\r\n        const fromMs = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate(), 0, 0, 0, 0).valueOf();\r\n        const toMs = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 0, 0, 0, 0).valueOf();\r\n        const now = new Date();\r\n        const nowMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).valueOf();\r\n        return (nowMs < fromMs) ? 'Ожидание' : (nowMs >= fromMs && nowMs < toMs) ? 'В процессе' : 'Завершен';\r\n    }\r\n    \r\n    getStatusClass() {\r\n        return (this.status === 'Ожидание') ? 'success' : (this.status === 'В процессе') ? 'warning' : 'danger';\r\n    }\r\n    getFieldsArray() {\r\n        return [this.countryName, this.dateFrom, this.dateTo, this.status];\r\n    }\r\n    \r\n    async setFlag() {\r\n        try {\r\n            const response = await fetch(`https://restcountries.eu/rest/v2/alpha/${this.countryCode}?fields=flag`);\r\n            if (response.status === 404) {\r\n                throw new Error('Флаг для данной страны не найден');\r\n            }\r\n            const data = await response.json();\r\n            this.flag = data.flag;\r\n        } catch (err) {\r\n        }\r\n    }\r\n    async setCountryData() {\r\n        let country;\r\n        try {\r\n            country = new _country_entity__WEBPACK_IMPORTED_MODULE_0__[\"default\"](this.countryCode);\r\n            await country.loadData(['latlng', 'languages', 'flag', 'callingCodes', 'borders', 'currencies']);\r\n        } catch (err) {\r\n            console.log('Доп. данные не загружены');\r\n        }\r\n        finally {\r\n            this.countryInfo = country.data;\r\n        }\r\n    }\r\n    \r\n    async edit(dates) {\r\n        try {\r\n            const requestData = {\r\n                id: this.id,\r\n                dateFrom: dates.dateFrom,\r\n                dateTo: dates.dateTo\r\n            }\r\n            const response = await fetch('/vacation', {\r\n                method: 'PUT',\r\n                credentials: 'same-origin',\r\n                headers: {'Content-Type': 'application/json'},\r\n                body: JSON.stringify(requestData)\r\n            });\r\n            if (response.redirected) {\r\n                window.location.href = response.url;\r\n            }\r\n            const data = await response.json();\r\n            if (!data.ok) {\r\n                throw new Error(data.caption);\r\n            }\r\n            const vacation = data.vacation;\r\n            this.dateFrom = new Date(vacation.dateFrom).toLocaleDateString();\r\n            this.dateTo = new Date(vacation.dateTo).toLocaleDateString();\r\n            this.status = Vacation.calculateStatus(vacation.dateFrom, vacation.dateTo);\r\n            return {ok: data.ok, caption: data.caption};\r\n        } catch (err) {\r\n            return {ok: false, caption: err.message};\r\n        }\r\n    }\r\n    async remove() {\r\n        try {\r\n            const response = await fetch('/vacation', {\r\n                method: 'DELETE',\r\n                credentials: 'same-origin',\r\n                headers: {'Content-Type': 'application/json'},\r\n                body: JSON.stringify({id: this.id})\r\n            });\r\n            if (response.redirected) {\r\n                window.location.href = response.url;\r\n            }\r\n            const data = await response.json();\r\n            return data;\r\n        } catch (err) {\r\n            return {ok: false, caption: 'Вутрення ошибка сервера'};\r\n        }\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./public/js/entities/vacation-entity.js?");

/***/ }),

/***/ "./public/js/helpers/formatDatepickers.js":
/*!************************************************!*\
  !*** ./public/js/helpers/formatDatepickers.js ***!
  \************************************************/
/*! exports provided: formatDate, setDatePickersOptions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"formatDate\", function() { return formatDate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setDatePickersOptions\", function() { return setDatePickersOptions; });\nfunction formatDate(date) {\r\n    const year = date.getFullYear();\r\n    const month = (date.getMonth() < 10) ? '0' + (date.getMonth() + 1) : date.getMonth();\r\n    const day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();\r\n    return `${year}-${month}-${day}`;\r\n}\r\nfunction setDatePickersOptions() {\r\n    const now = new Date();\r\n    const vacationDateFrom = document.querySelector('#dateFrom');\r\n    const vacationDateTo = document.querySelector('#dateTo');\r\n    vacationDateFrom.min = formatDate(now);\r\n    const minForDateTo = new Date();\r\n    minForDateTo.setDate(minForDateTo.getDate() + 1);\r\n    vacationDateTo.min = formatDate(minForDateTo);\r\n}\r\n\n\n//# sourceURL=webpack:///./public/js/helpers/formatDatepickers.js?");

/***/ }),

/***/ "./public/js/helpers/popup.js":
/*!************************************!*\
  !*** ./public/js/helpers/popup.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return editPopup; });\n/* harmony import */ var _server_feedback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./server-feedback */ \"./public/js/helpers/server-feedback.js\");\n/* harmony import */ var _formatDatepickers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./formatDatepickers */ \"./public/js/helpers/formatDatepickers.js\");\n/* harmony import */ var _validator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./validator */ \"./public/js/helpers/validator.js\");\n\r\n\r\n\r\n\r\nfunction editPopup(html, vacation, updateCallback) {\r\n    const popup = document.getElementById(html);\r\n    const popupTitle = popup.querySelector('#js-popup-title');\r\n    const form = popup.querySelector('#form-edit');\r\n    const dateFrom = popup.querySelector('#dateFrom');\r\n    const dateTo = popup.querySelector('#dateTo');\r\n    const submit = popup.querySelector('#popup-submit');\r\n    popupTitle.innerText = vacation.countryName;\r\n    dateFrom.value = vacation.dateFrom.split('.').reverse().join('-');\r\n    dateTo.value = vacation.dateTo.split('.').reverse().join('-');\r\n    submit.addEventListener('click', async function (e) {\r\n        e.preventDefault();\r\n        const error = Object(_validator__WEBPACK_IMPORTED_MODULE_2__[\"validate\"])(form);\r\n        if (error) return;\r\n        const result =  await vacation.edit({\r\n            dateFrom: dateFrom.value,\r\n            dateTo: dateTo.value\r\n        });\r\n        Object(_server_feedback__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(result);\r\n        if (result.ok) {\r\n            updateCallback();\r\n        }\r\n        closePopup(popup);\r\n    });\r\n    Object(_formatDatepickers__WEBPACK_IMPORTED_MODULE_1__[\"setDatePickersOptions\"])();\r\n    Object(_validator__WEBPACK_IMPORTED_MODULE_2__[\"setValidateListeners\"])(form);\r\n    openPopup(popup);\r\n}\r\n\r\nfunction openPopup(popup) {\r\n    popup.classList.add('open');\r\n    popup.style.display = 'block';\r\n}\r\nfunction closePopup(popup) {\r\n    if (popup.classList.contains('open')) {\r\n        popup.style.display = 'none';\r\n        popup.classList.remove('open');\r\n    }\r\n}\r\n\r\nconst popupCloseBtn = document.querySelector('.js-popup-close');\r\npopupCloseBtn.addEventListener('click', function () {\r\n    closePopup(this.closest('.js-popup-wrapper'));\r\n});\r\ndocument.addEventListener('mouseup', function(e) {\r\n    const target = e.target.closest('.js-popup');\r\n    const popup = document.querySelector('.js-popup');\r\n    const popupWrapper = document.querySelector('.js-popup-wrapper');\r\n    if (target !== popup) {\r\n        closePopup(popupWrapper);\r\n    }\r\n});\r\ndocument.addEventListener('keyup', function(e) {\r\n    const popupWrapper = document.querySelector('.js-popup-wrapper');\r\n    if (e.code === 'Escape') {\r\n        closePopup(popupWrapper);\r\n    }\r\n});\r\n\r\n\n\n//# sourceURL=webpack:///./public/js/helpers/popup.js?");

/***/ }),

/***/ "./public/js/helpers/server-feedback.js":
/*!**********************************************!*\
  !*** ./public/js/helpers/server-feedback.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return setServerFeedback; });\nfunction setServerFeedback(data, time = 4000) {\r\n    const serverFeedback = document.querySelector('#serverFeedback');\r\n    serverFeedback.classList.remove('alert-success', 'alert-danger');\r\n    serverFeedback.classList.add(data.ok ? 'alert-success' : 'alert-danger');\r\n    serverFeedback.hidden = false;\r\n    serverFeedback.innerText = data.caption;\r\n    setTimeout(() => {\r\n        serverFeedback.hidden = true;\r\n    }, time)\r\n}\r\n\n\n//# sourceURL=webpack:///./public/js/helpers/server-feedback.js?");

/***/ }),

/***/ "./public/js/helpers/validator.js":
/*!****************************************!*\
  !*** ./public/js/helpers/validator.js ***!
  \****************************************/
/*! exports provided: validate, setValidateListeners */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"validate\", function() { return validate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setValidateListeners\", function() { return setValidateListeners; });\nfunction validate(form) {\r\n    const formControls = Array.from(form.querySelectorAll('.form-control'));\r\n    let hasError = false;\r\n    for (let i = 0; i < formControls.length; i++) {\r\n        const feedback = formControls[i].closest('.form-group').querySelector('.invalid-feedback');\r\n        removeFeedback(formControls[i], feedback);\r\n        const error = validateInput(formControls[i], form);\r\n        if (error) {\r\n            setFeedback(formControls[i], feedback, error);\r\n            hasError = true;\r\n        }\r\n    }\r\n    if(hasError) return true;\r\n}\r\n\r\nfunction setValidateListeners(form) {\r\n    const formControls = Array.from(form.querySelectorAll('.form-control'));\r\n    const btn = form.querySelector('button');\r\n    formControls.forEach(input => {\r\n        const feedback = input.closest('.form-group').querySelector('.invalid-feedback');\r\n        input.addEventListener('blur', function () {\r\n            const error = validateInput(input, form);\r\n            if (error) setFeedback(input, feedback, error);\r\n        });\r\n        input.addEventListener('input', removeFeedback.bind(this, input, feedback));\r\n    })\r\n}\r\n\r\nfunction checkInputIsEmpty(input) {\r\n    if (!input.value) {\r\n        return 'Поле обязательное для заполнения';\r\n    }\r\n}\r\nfunction checkLength(input, mixValue) {\r\n    if (input.value.length < mixValue) {\r\n        return `Поле должно содержать больше ${mixValue-1}-х символов`;\r\n    }\r\n}\r\nfunction matchPasswords(password, confirmPassword) {\r\n    if (password.value !== confirmPassword.value) {\r\n        return 'Пароли не совпадают';\r\n    }\r\n}\r\nfunction checkPattern(input, pattern) {\r\n    const regExp = new RegExp(pattern, 'gi');\r\n    if (!regExp.test(input.value)) {\r\n        return 'Неверный формат данных';\r\n    }\r\n}\r\n\r\nfunction validateInput(input) {\r\n    const inputData = input.dataset;\r\n    let error;\r\n    if(input.hasAttribute('required')) {\r\n        error = checkInputIsEmpty(input);\r\n        if (error) return error;\r\n    }\r\n    if(inputData.min) {\r\n        error = checkLength(input, inputData.min);\r\n        if (error) return error;\r\n    }\r\n    if (inputData.pattern) {\r\n        error = checkPattern(input, inputData.pattern);\r\n        if (error) return error;\r\n    }\r\n    if(inputData.comparewith) {\r\n        let password = document.getElementById(inputData.comparewith);\r\n        error = matchPasswords(password, input);\r\n        if (error) return error;\r\n    }\r\n    return false;\r\n}\r\n\r\nfunction setFeedback(input, feedback, feedbackText) {\r\n    input.classList.add('is-invalid');\r\n    feedback.style.display = 'block';\r\n    feedback.innerText = feedbackText;\r\n}\r\nfunction removeFeedback(input, feedback) {\r\n    input.classList.remove('is-invalid');\r\n    feedback.style.display = 'none';\r\n}\r\n\n\n//# sourceURL=webpack:///./public/js/helpers/validator.js?");

/***/ }),

/***/ "./public/js/home.js":
/*!***************************!*\
  !*** ./public/js/home.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helpers_server_feedback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/server-feedback */ \"./public/js/helpers/server-feedback.js\");\n/* harmony import */ var _helpers_popup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers/popup */ \"./public/js/helpers/popup.js\");\n/* harmony import */ var _entities_vacation_entity__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./entities/vacation-entity */ \"./public/js/entities/vacation-entity.js\");\n\r\n\r\n\r\n\r\nconst vacationsTableBody = document.querySelector('#vacations-table tbody');\r\nconst filterButtonsWrapper = document.querySelector('#filter-buttons');\r\nconst filterButtons = Array.from(filterButtonsWrapper.querySelectorAll('button'));\r\nconst byName = document.getElementById('byName');\r\nconst byDateTo = document.getElementById('byDateTo');\r\nconst byStatus = document.getElementById('byStatus');\r\nconst search = document.getElementById('search');\r\nconst spinner = document.querySelector('#spinner');\r\n\r\nwindow.onload = async function() {\r\n    \r\n    const table = new VacationsTable();\r\n    spinner.hidden = false;\r\n    try {\r\n        await table.loadData();\r\n        table.fill();\r\n    } catch (err) {\r\n        Object(_helpers_server_feedback__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({ok: false, caption: err});\r\n    } finally {\r\n        spinner.hidden = true;\r\n    }\r\n    \r\n    filterButtonsWrapper.addEventListener('click', function (e) {\r\n        const target = e.target;\r\n        if (target.tagName === 'BUTTON') {\r\n            filterButtons.forEach(button => button.classList.remove('active'));\r\n            target.classList.add('active');\r\n        }\r\n    });\r\n    byName.addEventListener('click', table.sortBy.bind(table, 'countryName'));\r\n    byDateTo.addEventListener('click', table.sortBy.bind(table, 'dateTo'));\r\n    byStatus.addEventListener('click', table.sortBy.bind(table, 'status'));\r\n    search.addEventListener('input', function () {\r\n        table.filterBy( 'countryName', this.value);\r\n    });\r\n}\r\n\r\nclass Vacations {\r\n    constructor() {\r\n        this.storage = [];\r\n        this.tmpStorage = [];\r\n    }\r\n\r\n    async loadData() {\r\n        try {\r\n            const response = await fetch('/api/getVacations', {\r\n                method: 'GET',\r\n                credentials: 'same-origin',\r\n                headers: {'Content-Type': 'application/json'}\r\n            });\r\n            const result = await response.json();\r\n            for (let i = 0; i < result.vacations.length; i++) {\r\n                const vacation = new _entities_vacation_entity__WEBPACK_IMPORTED_MODULE_2__[\"default\"](result.vacations[i]);\r\n                await vacation.setFlag();\r\n                this.storage.push(vacation);\r\n            }\r\n        }\r\n        catch (err) {\r\n            throw err;\r\n        }\r\n    }\r\n    filterBy(field, value) {\r\n        if (!this.tmpStorage.length) {\r\n            this.tmpStorage = this.storage.slice();\r\n        }\r\n        if (!value) {\r\n            this.storage = this.tmpStorage.slice();\r\n            this.tmpStorage.length = 0;\r\n            return;\r\n        }\r\n        value = value.toLowerCase();\r\n        this.storage = this.tmpStorage.filter(x => x[field].toLowerCase().includes(value));\r\n    }\r\n    sortBy(field) {\r\n        function compare(a, b) {\r\n            return (a[field] < b[field]) ? -1 : (a[field] > b[field]) ?  1 : 0;\r\n        }\r\n        this.storage.sort(compare);\r\n    }\r\n    removeFromStorage(vacation) {\r\n        console.log(vacation);\r\n        if(this.tmpStorage.length) {\r\n            const index = this.tmpStorage.indexOf(vacation);\r\n            this.tmpStorage.splice(index, 1);\r\n            // thi.tmpStorage = this.tmpStorage.filter()\r\n        }\r\n        const index = this.storage.indexOf(vacation);\r\n        this.storage.splice(index, 1);\r\n    }\r\n}\r\n\r\nclass VacationsTable extends Vacations {\r\n    constructor() {\r\n        super();\r\n    }\r\n\r\n    sortBy(field) {\r\n        super.sortBy(field);\r\n        this.fill();\r\n    }\r\n    filterBy(field, value) {\r\n        super.filterBy(field, value);\r\n        this.fill();\r\n    }\r\n\r\n    formatNameCell(cell, vacation) {\r\n        if (vacation.flag) {\r\n            const flagImg = document.createElement('img');\r\n            flagImg.classList.add('flag');\r\n            flagImg.src = vacation.flag;\r\n            cell.appendChild(flagImg);\r\n        }\r\n        const name = document.createElement('span');\r\n        name.innerText = vacation.countryName;\r\n        cell.appendChild(name);\r\n    }\r\n    formatDateCell(cell, date) {\r\n        cell.classList.add('text-center');\r\n        cell.innerText = date\r\n    }\r\n    formatStatusCell(parent, data ,status) {\r\n        const span = document.createElement('span');\r\n        span.classList.add('badge', `badge-${status}`);\r\n        span.innerText = data;\r\n        parent.appendChild(span);\r\n    }\r\n    \r\n    createActionCell(parent) {\r\n        const td = document.createElement('td');\r\n        td.classList.add('action-td');\r\n        parent.appendChild(td);\r\n        return td;\r\n    }\r\n    createActionBtns(parent, vacation) {\r\n        const wrapper = document.createElement('div');\r\n        wrapper.classList.add('action-block');\r\n        \r\n        const edit = this.createActionItem(['fa-pen', 'text-warning']);\r\n        edit.addEventListener('click', (e) => {\r\n            e.stopPropagation();\r\n            Object(_helpers_popup__WEBPACK_IMPORTED_MODULE_1__[\"default\"])('edit-popup', vacation, this.fill.bind(this));\r\n        });\r\n        wrapper.appendChild(edit);\r\n\r\n        const remove = this.createActionItem(['fa-trash-alt', 'text-danger']);\r\n        remove.addEventListener('click', async (e) => {\r\n            e.stopPropagation();\r\n            const bool = confirm(\"Вы хотите удалить запись?\");\r\n            if (bool) {\r\n                spinner.hidden = false;\r\n                const data = await vacation.remove();\r\n                Object(_helpers_server_feedback__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(data);\r\n                if (data.ok) {\r\n                    this.removeFromStorage(vacation);\r\n                    this.fill();\r\n                }\r\n                spinner.hidden = true;\r\n            }\r\n        });\r\n        wrapper.appendChild(remove);\r\n\r\n        parent.appendChild(wrapper);\r\n    }\r\n    createActionItem(actionClass) {\r\n        const actionBtn = document.createElement('button');\r\n        actionBtn.classList.add('btn');\r\n        const actionBtnItem = document.createElement('i');\r\n        actionBtn.appendChild(actionBtnItem);\r\n        actionBtn.classList.add('fas', ...actionClass);\r\n        return actionBtn;\r\n    }\r\n    \r\n    renderEmptyRow() {\r\n        const tr = document.createElement('tr');\r\n        vacationsTableBody.appendChild(tr);\r\n        const td = document.createElement('td');\r\n        td.colSpan = 5;\r\n        td.classList.add('text-center');\r\n        td.innerText = 'У вас пока нет отпусков';\r\n        tr.appendChild(td);\r\n    }\r\n    renderRow(vacation, body) {\r\n        const tr = document.createElement('tr');\r\n        tr.classList.add('table-row');\r\n        tr.addEventListener('click', function () {\r\n            window.location.href = '/vacation/' + vacation.id;\r\n        });\r\n        body.appendChild(tr);\r\n\r\n        const values = vacation.getFieldsArray();\r\n        for (let index = 0; index < values.length; index++) {\r\n            const td = document.createElement('td');\r\n            if (!index) {\r\n                this.formatNameCell(td, vacation);\r\n            }\r\n            if (index === 1 || index === 2) {\r\n                this.formatDateCell(td, values[index]);\r\n            }\r\n            if (index === 3) {\r\n                const status = vacation.getStatusClass();\r\n                this.formatStatusCell(td, values[index], status);\r\n            }\r\n            tr.appendChild(td);\r\n        }\r\n        \r\n        const td = this.createActionCell(tr, vacation);\r\n        if (vacation.status !== 'Завершен') {\r\n            this.createActionBtns(td, vacation);\r\n        }\r\n    }\r\n\r\n    fill() {\r\n        vacationsTableBody.innerHTML = '';\r\n        if (!this.storage.length) {\r\n            this.renderEmptyRow(vacationsTableBody);\r\n            return;\r\n        }\r\n        for (let i = 0; i < this.storage.length; i++) {\r\n            this.renderRow(this.storage[i], vacationsTableBody);\r\n        }\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack:///./public/js/home.js?");

/***/ })

/******/ });