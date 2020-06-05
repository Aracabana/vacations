const connection = require('../db');

async function insert(vacation, userId) {
    const {countryName, countryCode, dateFrom, dateTo, status} = vacation;
    const sql = 'INSERT INTO vacations (countryName, countryCode, dateFrom, dateTo, user_id) VALUES (?, ?, ?, ?, ?)';
    const values = [countryName, countryCode, dateFrom, dateTo, userId];
    try {
        const result = await connection.query(sql, values);
        return result[0].insertId;
    } catch (err) {
        if (err) throw err;
    }
}

async function remove(id) {
    const sql = 'DELETE  FROM vacations WHERE id = ?';
    try {
        const result = await connection.query(sql, [id]);
        return result[0].affectedRows;
    } catch (err) {
        if (err) throw err;
    }
}

async function getAllByUserId(userId) {
    const sql = 'SELECT id, countryName, dateFrom, dateTo FROM vacations WHERE user_id = ?';
    try {
        const result = await connection.query(sql, [userId]);
        const vacations = JSON.parse(JSON.stringify(result[0]));
        return vacations;
    } catch (err) {
        if (err) throw err;
    }
}

async function getVacationByDate(dateFrom, dateTo) {
    const sql = 'SELECT * FROM vacations WHERE dateFrom = ? and dateTo = ?';
    try {
        const result = await connection.query(sql, [dateFrom, dateTo]);
        const vacations = JSON.parse(JSON.stringify(result[0]));
        return vacations;
    }
    catch (err) {
        if (err) throw err;
    }
}

async function getVacationById(id) {
    const sql = 'SELECT * FROM vacations WHERE id = ?';
    try {
        const result = await connection.query(sql, [id]);
        const vacation = JSON.parse(JSON.stringify(result[0]));
        return vacation;
    }
    catch (err) {
        if (err) throw err;
    }
}

module.exports = { insert, remove, getAllByUserId, getVacationByDate, getVacationById };
