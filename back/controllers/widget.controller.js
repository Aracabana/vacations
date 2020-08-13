const {ActiveWidgets, BudgetWidget} = require('../models');

async function insert(request, response) {
    const {vacationId, widgetId} = request.body;
    try {
        const result = await ActiveWidgets.insert(vacationId, widgetId);
        if (!result) {
            throw new Error('Ошибка сервера');
        }
        response.json({ok: true});
    } catch (err) {
        response.json({ok: false, caption: err.message});
    }
}

async function remove(request, response) {
    const {widgetId, vacationId} = request.body;
    try {
        const result = await ActiveWidgets.remove(widgetId, vacationId);
        if (!result) {
            throw new Error('Ошибка сервера');
        }
        response.json({ok: true});
    } catch (err) {
        response.json({ok: false, caption: err.message});
    }
}

async function getAll(request, response) {
    const {vacationId} = request.query;
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

async function getBudgetInfoByVacationId(request, response) {
    const {vacationId} = request.query;
    try {
        const info = await BudgetWidget.getInfoByVacationId(vacationId);
        response.json({ok: true, info});
    } catch (err) {
        response.json({ok: false, caption: err.message});
    }
}

async function insertBudgetInfo(request, response) {
    const {data, vacationId} = request.body;
    try {
        const result = await BudgetWidget.insert(data.categoryId, data.name, data.price, vacationId);
        if (result) {
            response.json({ok: true});
            return;
        }
        throw new Error('Ошибка сервера');
    } catch (err) {
        response.json({ok: false, caption: err.message});
    }
}

module.exports = {insert, remove, getAll, getBudgetInfoByVacationId, insertBudgetInfo};
