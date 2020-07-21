const { Vacation, Countries }          = require('../../models');

async function validate(dateFrom, dateTo, countryName) {
    
    if (!countryName || !dateFrom || !dateTo) {
        throw new Error('Не все поля заполнены');
    }
    
    await validateDates(dateFrom, dateTo);

    try {
        const foundCountry = await Countries.getOneBy('countryName', countryName);
        if (!foundCountry) {
            throw new Error('Некорректное название страны');
        }
        return foundCountry;
    } catch (err) {
        throw err;
    }
}

async function validateDates(dateFrom, dateTo) {
    const valueOfDateFrom = new Date(dateFrom).valueOf();
    const valueOfDateTo = new Date(dateTo).valueOf();
    const now = new Date();
    const nowUTC0 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const tomorrow = nowUTC0.valueOf() + (24 * 60 * 60 * 1000);
    
    if (valueOfDateFrom >= valueOfDateTo) {
        throw new Error('Некорректные даты');
    }
    
    if (valueOfDateFrom < nowUTC0 || valueOfDateTo < tomorrow) {
        throw new Error('Некорректные даты');
    }
    
    try {
        const vacationOnThisDate = await Vacation.getOneByDate(dateFrom, dateTo);
        if (vacationOnThisDate.length) {
            throw new Error('Отпуск на этот период уже есть');
        }
    }
    catch (err) {
        throw err;
    }
}

module.exports = { validate, validateDates };
