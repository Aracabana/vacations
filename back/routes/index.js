const access = require('./access.router');
const auth = require('./auth.router');
const vacation = require('./vacation.router');
const api = require('./api.router');
const countries = require('./countries.router');

module.exports = { access, auth, vacation, countries, api };