const fs                = require('fs');
const path              = require("path");

function getGeoJSON (request, response) {
    const { countryCode } = request.query;
    const path = `helpers/geoJsons/${countryCode}.json`;
    const parsedObj = fs.readFileSync(path, 'utf8');
    response.send(parsedObj);
}

module.exports = { getGeoJSON }
