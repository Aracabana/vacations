import {FilterBuilder} from '../../utils/FilterBuilder';
import request from "../../utils/request";
import countryParser from "../../utils/countryParser";
import router from '../../router'

export default {
  state: {
    selectedCountry: {},
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
  actions: {
    async loadCountries({commit}) {
      try {
        const { countries } = await request('/countries/all');
        commit('setCountries', countryParser(countries));
        commit('filterCountries');
      } catch (err) {
        commit('updateNotification', {page: router.currentRoute.name, ok: false, caption: err.message});
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
    },

    async selectCountry({commit, getters}, countryId) {
      const selectedCountry = getters.getCountryById(countryId);
      commit('setSelectedCountry', selectedCountry);
    }
  },
  mutations: {
    setCountries: (state, countries) => state.countries = countries,
    setSelectedCountry: (state, selectedCountry) => state.selectedCountry = selectedCountry,
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
    getSelectedCountry(state) {
      return state.selectedCountry;
    },
    getContinentsForSelect(state) {
      const result = [];
      state.filteredCountries.forEach(country => {
        const foundItem = result.find(item => item.continentName === country.continentName);
        const itemForSelect = {
          countryId: country.id,
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
    },
    selectedCountryIsEmpty(state) {
      const obj = state.selectedCountry;
      for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
          return false;
        }
      }
      return true;
    },
    selectedCountryHasLatLng(state) {
      return state.selectedCountry?.latlng?.length;
    }
  },
}
