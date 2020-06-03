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
    
    async setCountries() {
        if (!this.storage.length) {
            try {
                const countries = await geoNames.countryInfo({});
                this.storage = countries.geonames;
            }
            catch (err) {
                throw err;
            }
        }
    }

    async getAllNames() {
        await this.setCountries();
        const countryNames = this.storage.map(country => country.countryName);
        return countryNames;
    }
    
    async searchCountryBy(field, value) {
        await this.setCountries();
        const foundCountry = this.storage.find(item => item[field] === value);
        return foundCountry;
    }
}
const countries = new Countries();


module.exports = { geoNames, countries };
