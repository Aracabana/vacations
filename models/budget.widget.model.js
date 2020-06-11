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

async function getInfoByVacationId(vacationId) {
    const sql = `SELECT budget_categories.id, budget_categories.name as category, budget_data.name, budget_data.price   FROM budget_data LEFT JOIN budget_categories ON budget_data.category_id = budget_categories.id WHERE budget_data.vacation_id = ?`;
    try {
        const result = await connection.query(sql, [vacationId]);
        const info = JSON.parse(JSON.stringify(result[0]));
        console.log(info);
        return info;
    } catch (err) {
        throw err;
    }
}

module.exports = { insert, remove, getInfoByVacationId };
