const connection = require('../db');

async function insert(categoryId, name, price, vacationId) {
    const sql = 'INSERT INTO budget_data (category_id, name, price, vacation_id) VALUES ?';
    const values = [[categoryId, name, price, vacationId]];
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
    let sql = `SELECT categories.id, categories.name as category, data.name, data.price FROM budget_categories as categories LEFT OUTER JOIN (SELECT * FROM budget_data WHERE vacation_id = ?) as data ON data.category_id = categories.id`;
    
    let sumSQl = `SELECT categories.name as category, COALESCE(SUM(data.price),0) as sum FROM budget_categories as categories LEFT OUTER JOIN (SELECT * FROM budget_data WHERE budget_data.vacation_id = ?) as data ON data.category_id = categories.id group by categories.name`;
    try {
        let result = await connection.query(sql, [vacationId]);
        const info = JSON.parse(JSON.stringify(result[0]));
        result = await connection.query(sumSQl, [vacationId]);
        const sum = JSON.parse(JSON.stringify(result[0]));
        return adaptInfo(info, sum);
    } catch (err) {
        throw err;
    }
}

function adaptInfo(info, categorySum) {
    const result = [];
    info.forEach(item => {
        const category = item.category;
        const find = result.find(x => x.category === category);
        const formattedData = {name: item.name, price: item.price};
        if (find) {
            find.items.push(formattedData);
        } else {
            result.push({
                id: item.id,
                category: item.category,
                sum: Number(categorySum.find(x => x.category === category).sum),
                items: (item.name) ? [formattedData] : []
            });
        }
    });
    return result;
}

module.exports = { insert, remove, getInfoByVacationId };
