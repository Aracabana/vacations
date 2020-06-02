const connection = require('../db');
const bcrypt = require('bcrypt');

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

async function getUser(login) {
    const sql = 'SELECT * FROM users WHERE users.login = ?';
    try {
        const result = await connection.query(sql, [login]);
        const user = JSON.parse(JSON.stringify(result[0]));
        return user[0];
    } catch (err) {
        if (err) throw err;
    }
}

module.exports = {insert, getUser}
