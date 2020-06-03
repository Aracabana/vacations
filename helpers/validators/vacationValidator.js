const { countries }         = require('../geonames');
const { Vacation }          = require('../../models');

async function validate(country, dateFrom, dateTo) {

    const valueOfDateFrom = new Date(dateFrom).valueOf();
    const valueOfDateTo = new Date(dateTo).valueOf();
    const now = new Date();
    const nowUTC0 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
    const tomorrow = nowUTC0.valueOf() + (24 * 60 * 60 * 1000);
    
    if (!country || !dateFrom || !dateTo) {
        throw new Error('Не все поля заполнены');
    }
    if (valueOfDateFrom >= valueOfDateTo) {
        throw new Error('Некорректные даты');
    }
    if (valueOfDateFrom < nowUTC0 || valueOfDateTo < tomorrow) {
        throw new Error('Некорректные даты');
    }
    try {
        const vacationOnThisDate = await Vacation.getVacationByDate(dateFrom, dateTo);
        if (vacationOnThisDate.length) {
            throw new Error('Отпуск на этот период уже есть');
        }
    }
    catch (err) {
        throw err;
    }
    try {
        const foundCountry = await countries.searchCountryBy('countryName', country);
        if (!foundCountry) {
            throw new Error('Некорретное название страны');
        }
        return foundCountry.countryCode;
    }
    catch (err) {
        throw err;
    }
}

module.exports = { validate };
