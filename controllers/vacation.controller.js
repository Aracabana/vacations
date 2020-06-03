const { Vacation }          = require('../models');
const { countries }         = require('../helpers/geonames');
const { vacationValidator } = require('../helpers/validators');

async function getPage(request, response) {
    try {
        const countryNames = await countries.getAllNames();
        response.render('create-vacation', {
            pageTitle: 'Создать отпуск',
            title: 'Создать отпуск',
            login: request.session.login,
            btn: {
                link: '/',
                title: 'Вернуться к списку отпусков',
                icon: 'fa-angle-left',
                class: 'btn-light'
            },
            countryNames,
            scripts: ['validator', 'create-vacation']
        });
    } catch (err) {
        response.json({
            ok: false,
            caption: err.message
        })
    }
}
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
async function add(request, response) {
    const {country, dateFrom, dateTo} = request.body;
    try {
        const countryCode = await vacationValidator.validate(country, dateFrom, dateTo);
        const vacation = {
            countryName: country,
            countryCode,
            dateFrom,
            dateTo,
            status: 'Ожидаемый'
        };
        const userId = request.session.userId;
        const vacationId = await Vacation.insert(vacation, userId);
        response.json({
            ok: true,
            caption: 'Отпуск успешно создан',
            vacationId
        })
    }
    catch (err) {
        response.json({ ok: false, caption: err.message });
    }
}

module.exports = { getAllByUserId, add, getPage };
