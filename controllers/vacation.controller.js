const { Vacation }          = require('../models');
const { countries }         = require('../helpers/geonames');
const { vacationValidator } = require('../helpers/validators');

async function createPage(request, response) {
    try {
        const countriesWithCode = await countries.getForSelect();
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
            countriesWithCode,
            scripts: ['server-feedback', 'validator', 'country-entity', 'create-vacation', 'leaflet'],
            styles: ['leaflet']
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
    response.render('vacation', {
        pageTitle: 'Отпуск',
        title: '',
        login: request.session.login,
        btn: {
            link: '/',
            title: 'Вернуться к списку отпусков',
            icon: 'fa-angle-left',
            class: 'btn-light'
        },
        scripts: ['server-feedback', 'country-entity', 'vacation-entity', 'vacation', 'leaflet'],
        styles: ['leaflet']
    });
}

async function add(request, response) {
    const {country, dateFrom, dateTo} = request.body;
    try {
        const selectedCountry = await vacationValidator.validate(country, dateFrom, dateTo);
        const vacation = {
            countryName: country,
            countryCode: selectedCountry.isoAlpha3,
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
async function getAll(request, response) {
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
async function getOne(request, response) {
    const id = request.query.id;
    const userId = request.session.userId;
    if (!id) {
        response.json({ok: false, caption: 'Неверные параметры'});
        return;
    }
    try {
        const vacation = await Vacation.getVacationById(id, userId);
        if (!vacation) {
            throw new Error('Отпуск не найден');
        }
        response.json({ ok: true, vacation });
    } catch (err) {
        response.json({ ok: false, caption: err });
    }
}

module.exports = { add, remove, getAll, getOne, createPage, vacationPage };
