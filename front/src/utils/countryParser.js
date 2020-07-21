export default function (countries) {
  return countries.map(country => {
    country.borders = country.borders.split(';');
    country.callingCodes = country.callingCodes.split(';');
    country.languages = country.languages.split(';');
    country.latlng = country.latlng.split(';');
    country.currencies = (country.currencies !== 'not') ? JSON.parse(country.currencies) : [];
    return country;
  });
}
