import {FilterBuilder} from '../../utils/filterHelper';

export default {
  actions: {
    async loadCountries({commit, dispatch}) {
      try {
        const response = await fetch('http://api.geonames.org/countryInfoJSON?username=antondrik&lang=ru');
        if (response.status !== 200) {
          throw new Error('Ошибка загрузки стран');
        }
        const {geonames} = await response.json();
        if (geonames) {
          geonames.forEach(item => {
            item.additional = {};
            commit('setCountries', geonames);
          });
          commit('filterCountries');
        }
      } catch (err) {
        commit('updateNotification', {page: 'Home', ok: false, caption: err.message});
      }
    },

    async loadCountryAdditionalData({commit, state}, {countryCode, fields}) {
      const country = state.countries.find(country => country.isoAlpha3 === countryCode);
      for (let i = 0; i < fields.length; i++) {
        if (!country.additional.hasOwnProperty(fields[i])) {
          const response = await fetch(`https://restcountries.eu/rest/v2/alpha/${countryCode}?fields=${fields[i]}`);
          if (response.status === 404) {
            return false;
          }
          const result = await response.json();
          commit('setCountries', state.countries.map(country => {
            if (country.isoAplha3 === countryCode) {
              country.additional[fields[i]] = result[fields[i]];
            }
            return country;
          }));
        }
      }

      // commit('setCountryAdditionalData', res)
    },


    async searchCountry({commit, dispatch}, input) {
      commit('setCountriesSearchValue', input);
      dispatch('applyCountriesFilters');
    },

    async applyCountriesFilters({commit}) {
      commit('filterCountries');
    }
  },
  state: {
    currentCountry: [],
    countries: [],
    filteredCountries: [],
    countriesFilterOptions: {
      searchValue: '',
      searchField: 'countryName'
    }
  },
  mutations: {
    setCountries: (state, countries) => state.countries = countries,
    setCurrentCountry: (state, currentCountry) => state.currentCountry = currentCountry,
    setCountriesSearchValue: (state, searchValue) => state.countriesFilterOptions.searchValue = searchValue,

    filterCountries(state) {
      const countries = new FilterBuilder(state.countriesFilterOptions, [...state.countries]);
      state.filteredCountries = countries.search().get();
    }
  },
  getters: {
    getCountriesForSelect(state) {
      return state.filteredCountries.map(country => ({
        name: country.countryName,
        code: country.isoAlpha3
      }));
    },
    checkIfCountriesExist(state) {
      return state.countries.length;
    }
  },
}
