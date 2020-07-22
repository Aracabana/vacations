import {FilterBuilder} from '../../utils/FilterBuilder';
import request from "../../utils/request";
import countryParser from "../../utils/countryParser";
import concatCountries from '../../utils/concatCountries';

export default {
  actions: {
    async loadCountries({commit, dispatch}) {
      try {
        const { countries } = await request('/countries/all');
        commit('setCountries', countryParser(countries));
        commit('filterCountries');
      } catch (err) {
        commit('updateNotification', {page: 'Home', ok: false, caption: err.message});
      }
    },

    async searchCountry({commit, dispatch}, input) {
      commit('setCountriesSearchValue', input);
      dispatch('applyCountriesFilters');
    },

    async applyCountriesFilters({commit}) {
      commit('setContinentsToShow', 2);
      commit('filterCountries');
    },

    async increaseContinentsToShow({commit, state}, value) {
      commit('setContinentsToShow', value);
    }
  },
  state: {
    currentCountry: [],
    countries: [],
    filteredCountries: [],
    countriesFilterOptions: {
      searchValue: '',
      searchField: 'countryName',
      sortField1: 'continentName',
      sortField2: 'countryName'
    },
    lazyLoadingOptions: {
      continentsToShow: 2
    }
  },
  mutations: {
    setCountries: (state, countries) => state.countries = countries,
    setCurrentCountry: (state, currentCountry) => state.currentCountry = currentCountry,
    setCountriesSearchValue: (state, searchValue) => state.countriesFilterOptions.searchValue = searchValue,
    setContinentsToShow: (state, value) => state.lazyLoadingOptions.continentsToShow = value,

    filterCountries(state) {
      const countries = new FilterBuilder(state.countriesFilterOptions, [...state.countries]);
      state.filteredCountries = countries.search().sortByTwoFields().get();
    }
  },
  getters: {
    getCountryById: (state) => (id) => {
      return state.filteredCountries.find(item => item.id === id)
    },
    getContinentsForSelect(state) {
      const result = [];
      state.filteredCountries.forEach(country => {
        const foundItem = result.find(item => item.continentName === country.continentName);
        const itemForSelect = {
          countryName: country.countryName,
          isoAlpha3: country.isoAlpha3
        };
        if (foundItem) {
          foundItem.countries.push(itemForSelect);
        }
        else {
          result.push({
            continentName: country.continentName,
            countries: [itemForSelect],
          })
        }
      });
      // return result.filter((item, index) => index < state.lazyLoadingOptions.continentsToShow);
      return result;
    },
    countriesIsExist(state) {
      return state.countries.length;
    }
  },
}
