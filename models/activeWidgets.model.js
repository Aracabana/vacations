const connection = require('../db');

async function insert(user) {
    const {login, email, password} = user;
    const sql = 'INSERT INTO users (login, password, email) VALUES ?';
    const hash = await bcrypt.hash(password, 10);
    const values = [[login, hash, email]];
    try {
        const result = await connection.query(sql, [values]);
        return result[0].affectedRows;
    } catch (err) {
        if (err) throw err;
    }
}

async function getAllByVacationId(vacationId) {
    const sql = `SELECT widgets.name FROM active_widgets LEFT JOIN widgets ON active_widgets.widget_id=widgets.id WHERE active_widgets.vacation_id=?`;
    try {
        const result = await connection.query(sql, [vacationId]);
        const widgets = JSON.parse(JSON.stringify(result[0]));
        return widgets;
    } catch (err) {
        if (err) throw err;
    }
}

module.exports = { insert, getAllByVacationId }
