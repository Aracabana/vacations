import {FilterBuilder} from '../../utils/FilterBuilder';
import request from "../../utils/request";
import countryParser from "../../utils/countryParser";

export default {
  actions: {
    async loadCountries({commit, dispatch}) {
      try {
        setTimeout(async () => {
          const { countries } = await request('/api/getAllCountries');
          commit('setCountries', countryParser(countries));
          commit('filterCountries');
        }, 2000);

      } catch (err) {
        commit('updateNotification', {page: 'Home', ok: false, caption: err.message});
      }
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
        code: country.isoAlpha3,
        flag: country.flag
      }));
    },
    countriesIsExist(state) {
      return state.countries.length;
    }
  },
}
