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

    }
    catch (err) {
        throw err;
    }
}

module.exports = { validate };