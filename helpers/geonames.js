const Geonames = require('geonames.js');

const geoNames = new Geonames({
    username: 'antondrik',
    lang: 'ru',
    encoding: 'JSON'
});

class Countries {

    constructor() {
        this.storage = [];
    }

    async getAllNames() {
        if (!this.storage.length) {
            try {
                const countries = await geoNames.countryInfo({});
                this.storage = countries.geonames.map(country => country.countryName);
            }
            catch (err) {
                throw err;
            }
        }
        return this.storage;
    }
}
const countries = new Countries();


module.exports = { geoNames, countries };
