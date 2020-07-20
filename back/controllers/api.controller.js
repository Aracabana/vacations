const { countries }     = require('../helpers/geonames');
const fs                = require('fs');
const path              = require("path");

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


module.exports = { getGeoJSON, getCountry, getCountriesForSelect }
