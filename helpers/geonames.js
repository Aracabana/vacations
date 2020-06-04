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

    async getForSelect() {
        await this.setCountries();
        const countries = this.storage.map(country => {
            return {
                name: country.countryName,
                code: country.isoAlpha3
            }
        });
        return countries;
    }
    
    async searchCountryBy(field, value) {
        await this.setCountries();
        const foundCountry = this.storage.find(item => item[field] === value);
        return foundCountry;
    }
}
const countries = new Countries();


module.exports = { geoNames, countries };
