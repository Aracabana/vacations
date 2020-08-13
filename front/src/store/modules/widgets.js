import {FilterBuilder} from '../../utils/FilterBuilder';
import request from "../../utils/request";
import router from '../../router'
import WidgetFactory from '../../utils/WidgetsFactory';

export default {
  state: {
    widgets: [],
    filteredWidgets: [],
    // countriesFilterOptions: {
    //   searchValue: '',
    //   searchField: 'countryName',
    //   sortField1: 'continentName',
    //   sortField2: 'countryName'
    // }
  },
  actions: {
    async loadWidgets({commit}, vacationId) {
      try {
        const {widgets} = await request(`/api/widgets?vacationId=${vacationId}`);
        commit('setWidgets', widgets);
        // commit('filterWidgets');
      } catch (err) {
        commit('updateNotification', {page: router.currentRoute.name, ok: false, caption: err.message});
      }
    },

    async disableWidget({commit, state}, {widgetId, vacationId}) {
      try {
        const requestData = {widgetId, vacationId};
        const response = await request('/api/widgets', 'DELETE', requestData);
        if (response.ok) {
          commit('setWidgets', [...state.widgets.map(widget => {
            if (widget.id === widgetId) {
              widget.isActive = 0;
            }
            return widget;
          })]);
        }
      } catch (err) {
        commit('updateNotification', {page: router.currentRoute.name, ok: false, caption: err.message});
      }
    },

    async enableWidget({commit, state}, {widgetId, vacationId}) {
      try {
        const requestData = {widgetId, vacationId};
        const response = await request('/api/widgets', 'POST', requestData);
        if (response.ok) {
          commit('setWidgets', [...state.widgets.map(widget => {
            if (widget.id === widgetId) {
              widget.isActive = 1;
            }
            return widget;
          })])
        }
      } catch (err) {
        commit('updateNotification', {page: router.currentRoute.name, ok: false, caption: err.message})
      }
    }

    //
    // async searchCountry({commit, dispatch}, input) {
    //   commit('setCountriesSearchValue', input);
    //   dispatch('applyCountriesFilters');
    // },
    //
    // async applyCountriesFilters({commit}) {
    //   commit('filterCountries');
    // },
    //
    // async selectCountry({commit, getters}, countryId) {
    //   const selectedCountry = getters.getCountryById(countryId);
    //   commit('setSelectedCountry', selectedCountry);
    // }
  },
  mutations: {
    setWidgets: (state, widgets) => state.widgets = widgets

    // filterCountries(state) {
    //   const countries = new FilterBuilder(state.countriesFilterOptions, [...state.countries]);
    //   state.filteredCountries = countries.search().sortByTwoFields().get();
    // }
  },
  getters: {
    hasWidgets(state) {
      return state.widgets.length;
    },
    getActiveWidgets(state) {
      return state.widgets
        .filter(widget => widget.isActive)
        .map(WidgetFactory);
    },
    getInactiveWidgets(state) {
      return state.widgets
        .filter(widget => !widget.isActive)
        .map(WidgetFactory)
    }
  }
}
