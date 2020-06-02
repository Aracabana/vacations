const { Vacation } = require('../models');
const { geoNames, countries } = require('../helpers/geonames');

async function getAllByUserId(request, response) {
    const userId = request.session.userId;
    if (userId) {
        try {
            const vacations = await Vacation.getAllByUserId(userId);
            response.json({
                ok: true,
                vacations
            })
        } catch (err) {
            response.json({
                ok: false,
                caption: err.message
            });
        }
    }
}

async function validateVacationData(country, dateFrom, dateTo) {
    if (!country || !dateFrom || !dateTo) {
        throw new Error('Не все поля заполнены');
    }
    const valueOfDateFrom = new Date(dateFrom).valueOf();
    const valueOfDateTo = new Date(dateTo).valueOf();
    const now = new Date().valueOf();
    const tomorrow = now + (24 * 60 * 60 * 1000);
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
async function save(request, response) {
    const {country, dateFrom, dateTo} = request.body;
    try {
        await validateVacationData(country, dateFrom, dateTo);
    }
    catch (err) {
        response.json({ ok: false, caption: err.message });
    }
}

module.exports = { getAllByUserId, save };
