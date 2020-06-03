const { countries } = require('../geonames');

async function validate(country, dateFrom, dateTo) {

    const valueOfDateFrom = new Date(dateFrom).valueOf();
    const valueOfDateTo = new Date(dateTo).valueOf();
    const now = new Date().valueOf();
    const tomorrow = now + (24 * 60 * 60 * 1000);

    if (!country || !dateFrom || !dateTo) {
        throw new Error('Не все поля заполнены');
    }
    if (valueOfDateFrom >= valueOfDateTo) {
        throw new Error('Некорректные даты');
    }
    if (valueOfDateFrom < now || valueOfDateTo < tomorrow) {
        throw new Error('Некорректные даты');
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
