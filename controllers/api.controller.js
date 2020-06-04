const { countries }     = require('../helpers/geonames');
const fs                = require('fs');
const path              = require("path");

async function getCountry (request, response) {
    const { searchField, value } = request.body;
    try {
        const foundCountry = await countries.searchCountryBy(searchField, value);
        if (foundCountry) {
            response.json({ok: true, foundCountry});
        }
    } catch (err) {
        response({ok: false, caption: err});
    }

}

function getGeoJSON (request, response) {
    const { countryCode } = request.query;
    const path = `helpers/geoJsons/${countryCode}.json`;
    const parsedObj = fs.readFileSync(path, 'utf8');
    response.send(parsedObj);
}

module.exports = { getGeoJSON, getCountry }