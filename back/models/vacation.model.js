const connection = require('../db');

async function insert(vacation, userId) {
    const {dateFrom, dateTo, countryId} = vacation;
    const sql = 'INSERT INTO vacations (dateFrom, dateTo, user_id, country_id) VALUES (?, ?, ?, ?)';
    const values = [dateFrom, dateTo, userId, countryId];
    try {
        const result = await connection.query(sql, values);
        return result[0].insertId;
    } catch (err) {
        throw err;
    }
}

async function edit(dateFrom, dateTo, vacationId, userId) {
    const sql = 'UPDATE vacations SET dateFrom = ?, dateTo = ? WHERE id = ?';
    try {
        const result = await connection.query(sql, [dateFrom, dateTo, vacationId]);
        const record = await this.getOneById(vacationId, userId);
        return record;
    } catch (err) {
        throw err;
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
    const sql = 'SELECT * FROM vacations WHERE user_id = ?';
    try {
        const result = await connection.query(sql, [userId]);
        const vacations = JSON.parse(JSON.stringify(result[0]));
        return vacations;
    } catch (err) {
        if (err) throw err;
    }
}

async function getOneByDate(dateFrom, dateTo) {
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

async function getOneById(id, userId) {
    const sql = 'SELECT * FROM vacations WHERE id = ? AND user_id = ?';
    try {
        const result = await connection.query(sql, [id, userId]);
        const vacation = JSON.parse(JSON.stringify(result[0]));
        return vacation[0];
    }
    catch (err) {
        throw err;
    }
}

module.exports = { insert, edit, remove, getAllByUserId, getOneByDate, getOneById };
