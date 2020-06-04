const { Vacation }          = require('../models');
const { countries }         = require('../helpers/geonames');
const { vacationValidator } = require('../helpers/validators');

async function createPage(request, response) {
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
async function vacationPage(request, response) {
    const id = request.params.id;
    response.json({ok: true, id});
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
async function remove(request, response) {
    const { id } = request.body;
    try {
        await Vacation.remove(id);
        response.json({ok: true, caption: 'Отпуск успешно удален'});
    } catch (err) {
        response.json({ok: false, caption: err});
    }
}

module.exports = { add, remove, createPage, vacationPage };
