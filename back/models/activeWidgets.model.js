const connection = require('../db');

async function insert(vacationId, widgetId) {
    const sql = 'INSERT INTO active_widgets (vacation_id, widget_id) VALUES ?';
    const values = [[vacationId, widgetId]];
    try {
        const result = await connection.query(sql, [values]);
        return result[0].affectedRows;
    } catch (err) {
        throw err;
    }
}

async function remove(widgetId, vacationId) {
    const sql = 'DELETE FROM active_widgets WHERE widget_id = ? AND vacation_id = ?';
    try {
        const result = await connection.query(sql, [widgetId, vacationId]);
        return result[0].affectedRows;
    } catch (err) {
        throw err;
    }
}

async function getAllByVacationId(vacationId) {
    const sql = `SELECT widgets.id, widgets.name, IF(active_widgets.vacation_id, true, false) as isActive  FROM widgets LEFT OUTER JOIN (SELECT * FROM active_widgets WHERE active_widgets.vacation_id=?) as active_widgets ON widgets.id=active_widgets.widget_id`;
    try {
        const result = await connection.query(sql, [vacationId]);
        const widgets = JSON.parse(JSON.stringify(result[0]));
        return widgets;
    } catch (err) {
        throw err;
    }
}

module.exports = { insert, remove, getAllByVacationId }
