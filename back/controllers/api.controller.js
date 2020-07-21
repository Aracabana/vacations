const { countries }     = require('../helpers/geonames');
const fs                = require('fs');
const path              = require("path");
const connection        = require('../db');

async function getCountry (request, response) {
    const { searchField, value } = request.body;
    try {
        const foundCountry = await countries.searchCountryBy(searchField, value);
        if (foundCountry) {
            response.json({ok: true, foundCountry});
            return;
        }
        throw new Error('Страна не найдена');
    } catch (err) {
        response.json({ok: false, caption: err.message});
    }

}

function getGeoJSON (request, response) {
    const { countryCode } = request.query;
    const path = `helpers/geoJsons/${countryCode}.json`;
    const parsedObj = fs.readFileSync(path, 'utf8');
    response.send(parsedObj);
}

async function getCountriesForSelect (request, response) {
    try {
        const countriesWithCode = await countries.getForSelect();
        response.json({ok: true, countriesWithCode});
    } catch (err) {
        response.json({ok: false, caption: err.message});
    }
}

async function loadAll (request, response) {
    const data = request.body;
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
        response.json({ok: true, caption: result[0].affectedRows})
    } catch (err) {
        response.json({ok: false, caption: err.message});
    }
}

async function getAllCountries(request, response) {
    try {
        const sql = 'SELECT * FROM countries';
        const result = await connection.query(sql);
        response.json({ok: true, countries: result[0]});
    } catch (err) {
        response.json({ok: false, caption: err.message});
    }
}


module.exports = { getGeoJSON, getCountry, getCountriesForSelect, loadAll, getAllCountries }
