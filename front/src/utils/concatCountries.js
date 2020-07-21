import request from "./request";

export default async function (geonames) {
  console.log(geonames)
  for (let i = 0; i < geonames.length; i++) {

    const restCountriesResponse = await fetch(
      `https://restcountries.eu/rest/v2/alpha/${geonames[i].isoAlpha3}?fields=latlng;borders;callingCodes;currencies;flag;languages`
    );

    let restCountries = await restCountriesResponse.json();
    if (restCountries.hasOwnProperty('status')) {
      restCountries = undefined;
    }

    const additional = {
      latlng: (restCountries) ? restCountries?.latlng.join(';') : 'not',
      flag: (restCountries) ? restCountries?.flag : 'not',
      callingCodes: (restCountries) ? restCountries?.callingCodes.join(';') : 'not',
      borders: (restCountries) ? restCountries?.borders.join(';') : 'not',
      currencies: (restCountries) ? JSON.stringify(restCountries?.currencies) : 'not',
      languages: (restCountries) ? restCountries?.languages.map(item => item.name).join(';') : 'not'
    }
    const data = {
      capital: geonames[i].capital,
      continent: geonames[i].continent,
      continentName: geonames[i].continentName,
      countryName: geonames[i].countryName,
      isoAlpha3: geonames[i].isoAlpha3,
      population: geonames[i].population,
      areaInSqKm: geonames[i].areaInSqKm,
      ...additional
    }

    const response = await request('/api/loadAll', 'POST', data);
    console.log(response);
  }
}
