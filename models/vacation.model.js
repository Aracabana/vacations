const connection = require('../db');

async function insert(vacation, userId) {
    const {countryName, countryCode, dateFrom, dateTo, status} = vacation;
    const sql = 'INSERT INTO vacations (countryName, countryCode, dateFrom, dateTo, status, user_id) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [countryName, countryCode, dateFrom, dateTo, status, userId];
    try {
        const result = await connection.query(sql, values);
        return result[0].affectedRows;
    } catch (err) {
        if (err) throw err;
    }
}

async function getAllByUserId(userId) {
    const value = [userId];
    const sql = 'SELECT countryName, dateFrom, dateTo, status FROM vacations WHERE user_id = ?';
    try {
        const result = await connection.query(sql, [value]);
        const vacations = JSON.parse(JSON.stringify(result[0]));
        return vacations;
    } catch (err) {
        if (err) throw err;
    }
}

module.exports = {insert, getAllByUserId}
