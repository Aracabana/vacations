import Country from '../../../../public/js/entities/country-entity';
import request from '../../utils/request';
import { FilterBuilder } from "../../utils/filterHelper";

export default {
  actions: {
    async loadVacations({commit}) {
      const tmp = [];
      const { vacations } = await request('/api/getVacations');
      for (let i = 0; i < vacations.length; i++) {
        const vacation = new Vacation(vacations[i]);
        await vacation.setFlag();
        tmp.push(vacation);
      }
      commit('setVacations', tmp);
      commit('setFilteredVacations');
    },
    async removeVacation({commit, state}, vacationId) {
      try {
        const result = await request('/vacation', 'DELETE', {id: vacationId});
        if (result.ok) {
          commit('setVacations', state.vacations.filter(item => item.id !== vacationId));
          commit('filterVacations');
          commit('updateNotification', {ok: true, caption: 'Отпуск успешно удален'});
        }
      } catch (err) {
        commit('updateNotification', {ok: false, caption: 'Вутрення ошибка сервера'});
      }
    },
    async editVacation({commit, state}, vacation) {
      try {
        const result = await request('/vacation', 'PUT', {
          id: vacation.id,
          dateFrom: vacation.dateFrom,
          dateTo: vacation.dateTo
        });

        if (!result.ok) {
          throw new Error(result.caption);
        }

        const updatedVacation = new Vacation(vacation);
        await updatedVacation.setFlag();
        commit('setVacations', [...state.vacations.filter(item => item.id !== vacation.id), ...[updatedVacation]]);
        commit('filterVacations');
        commit('updateNotification', {ok: result.ok, caption: result.caption});

      } catch (err) {
        commit('updateNotification', {ok: false, caption: err.message});
      }
    },

    sort({commit}, sortField) {
      commit('setSortField', sortField);
      commit('sortVacations');
    },
    search({commit, dispatch}, input) {
      commit('setSearchValue', input);
      dispatch('filter');
    },
    filter({commit}) {
      commit('filterVacations');
    }
  },
  state: {
    vacations: [],
    filteredVacations: [],
    filterOptions: {
      searchValue: '',
      searchField: 'countryName',
      sortField: 'countryName'
    }
  },
  mutations: {
    setVacations: (state, vacations) => state.vacations = vacations,
    setFilteredVacations: (state) => state.filteredVacations = state.vacations,
    setSortField: (state, field) => state.filterOptions.sortField = field,
    setSearchValue: (state, input) => state.filterOptions.searchValue = input,

    filterVacations(state) {
      const vacations = new FilterBuilder(state.filterOptions, [...state.vacations]);
      state.filteredVacations = vacations.search().sort().get();
    },
    sortVacations(state) {
      const vacations = new FilterBuilder(state.filterOptions, [...state.filteredVacations]);
      state.filteredVacations = vacations.sort().get();
    }
  },
  getters: {
    getVacations(state) {
      return state.filteredVacations;
    }
  }
}

class Vacation {
  constructor(vacation) {
    this.id = vacation.id;
    this.countryName = vacation.countryName;
    this.countryCode = vacation.countryCode;
    this.dateFrom = new Date(vacation.dateFrom);
    this.dateTo = new Date(vacation.dateTo);
  }

  async setFlag() {
    try {
      const response = await fetch(`https://restcountries.eu/rest/v2/alpha/${this.countryCode}?fields=flag`);
      if (response.status === 404) {
        throw new Error('Флаг для данной страны не найден');
      }
      const data = await response.json();
      this.flag = data.flag;
    } catch (err) {
      console.log('Флаг не загружен');
    }
  }
  async setCountryData() {
    let country;
    try {
      country = new Country(this.countryCode);
      await country.loadData(['latlng', 'languages', 'flag', 'callingCodes', 'borders', 'currencies']);
    } catch (err) {
      console.log('Доп. данные не загружены');
    }
    finally {
      this.countryInfo = country.data;
    }
  }
}
