const { Vacation }          = require('../models');
const { vacationValidator } = require('../helpers/validators');

async function add(request, response) {
    const {dateFrom, dateTo, countryName} = request.body;
    try {
        const selectedCountry = await vacationValidator.validate(dateFrom, dateTo, countryName);
        const vacation = {dateFrom, dateTo, countryId: selectedCountry.id};
        const userId = request.session.userId;
        const vacationId = await Vacation.insert(vacation, userId);
        response.json({ok: true, caption: 'Отпуск успешно создан', vacationId});
    }
    catch (err) {
        response.json({ ok: false, caption: err.message });
    }
}

async function edit(request, response) {
    const { id, dateFrom, dateTo } = request.body;
    const userId = request.session.userId;
    try {
        await vacationValidator.validateDates(dateFrom, dateTo);
        const vacation = await Vacation.edit(dateFrom, dateTo, id, userId);
        if (vacation) {
            response.json({ok: true, caption: 'Запись успешно изменена', vacation});
            return;
        }
        throw new Error('Запись не изменена');
    } catch (err) {
        response.json({ok: false, caption: err.message});
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
async function getOne(request, response) {
    const id = request.query.id;
    const userId = request.session.userId;
    if (!id) {
        response.json({ok: false, caption: 'Неверные параметры'});
        return;
    }
    try {
        const vacation = await Vacation.getOneById(id, userId);
        if (!vacation) {
            throw new Error('Отпуск не найден');
        }
        response.json({ ok: true, vacation });
    } catch (err) {
        response.json({ ok: false, caption: err });
    }
}

module.exports = { add, edit, remove, getAll, getOne };
