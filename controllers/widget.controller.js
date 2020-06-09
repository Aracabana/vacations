const { ActiveWidgets } = require('../models');

async function insert(request, response) {
    const { vacationId, widgetId } = request.body;
    try {
        const result = await ActiveWidgets.insert(vacationId, widgetId);
        if (result) {
           response.json({ok: true});
        }
    } catch (err) {
        response.json({ok: false, caption: err.message});
    }
}

async function remove(request, response) {
    const { widgetId, vacationId } = request.body;
    try {
        const result = await ActiveWidgets.remove(widgetId, vacationId);
        if (result) {
            response.json({ok: true});
        }
    } catch (err) {
        response.json({ok: false, caption: err.message});
    }
}

async function getAll (request, response) {
    const { vacationId } = request.query;
    try {
        const widgets = await ActiveWidgets.getAllByVacationId(vacationId);
        if (!widgets.length) {
            throw new Error('Виджеты не выбраны');
        }
        response.json({ok: true, widgets});
    } catch (err) {
        response.json({ok: false, caption: err.message});
    }
}

module.exports = { insert, remove, getAll };
