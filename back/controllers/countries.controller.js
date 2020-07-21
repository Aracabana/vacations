const {Countries} = require('../models');

async function add(request, response) {
    const { data } = request.body;
    try {
        const country = await Countries.add(data);
        response.json({ ok: true, country });
    } catch (err) {
        response.json({ ok: false, caption: err });
    }
}

async function getOne(request, response) {
    const { countryName } = request.body;
    if (!countryName) {
        response.json({ok: false, caption: 'Неверные параметры'});
        return;
    }
    try {
        const country = await Countries.getOneBy('countryName', countryName);
        if (!country) {
            throw new Error('Страна не найдена');
        }
        response.json({ ok: true, country });
    } catch (err) {
        response.json({ ok: false, caption: err });
    }
}

async function getAll(request, response) {
    try {
        const countries = await Countries.getAll();
        response.json({ok: true, countries});
    } catch (err) {
        response.json({ok: false, caption: err.message});
    }
}

module.exports = { add, getOne, getAll };