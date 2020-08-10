const fs                = require('fs');
const path              = require("path");

function getGeoJSON (request, response) {
    const { countryCode } = request.query;
    const path = `helpers/geoJsons/${countryCode}.json`;
    try {
        const geoJson = fs.readFileSync(path, 'utf8');
        response.send(geoJson);
    } catch (e) {
        response.status(500).send('Файл не найден');
    }

}

module.exports = { getGeoJSON }
