const connection = require('../db');

async function add(requestData) {
    const data = requestData;
    const sql = 'INSERT INTO countries (capital, continent, continentName, ' +
        'countryName, isoAlpha3, population, areaInSqKm, borders, callingCodes, currencies, ' +
        'flag, languages, latlng) VALUES ?';
    const values = [[
        data.capital,
        data.continent,
        data.continentName,
        data.countryName,
        data.isoAlpha3,
        data.population,
        data.areaInSqKm,
        data.borders,
        data.callingCodes,
        data.currencies,
        data.flag,
        data.languages,
        data.latlng
    ]];
    try {
        const result = await connection.query(sql, [values]);
        return result[0].affectedRows;
    } catch (err) {
        throw err;
    }
}

async function getOneBy(field = 'countryName', value) {
    const sql = `SELECT * FROM countries WHERE countries.${field} = ?`;
    try {
        const result = await connection.query(sql, [value]);
        const country = JSON.parse(JSON.stringify(result[0]));
        return country[0];
    } catch (err) {
        throw err;
    }
}

async function getAll() {
    const sql = 'SELECT * FROM countries';
    try {
        const result = await connection.query(sql);
        return result[0];
    } catch (err) {
        throw err;
    }
}

module.exports = {add, getOneBy, getAll};
