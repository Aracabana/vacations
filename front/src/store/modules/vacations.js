import Country from '../../../../public/js/entities/country-entity';
import request from '../../utils/request';
import { FilterBuilder } from "../../utils/filterHelper";

export default {
  actions: {
    async loadVacations({commit}) {
      const tmp = [];
      const result = await request('/api/getVacations');
      if (result) {
        const { vacations } = result;
        for (let i = 0; i < vacations.length; i++) {
          const vacation = new Vacation(vacations[i]);
          await vacation.setFlag();
          tmp.push(vacation);
        }
        commit('setVacations', tmp);
        commit('filterVacations');
      }
    },
    async removeVacation({commit, state}, vacationId) {
      const result = await request('/vacation', 'DELETE', {id: vacationId});
      if (result) {
        commit('setVacations', state.vacations.filter(item => item.id !== vacationId));
        commit('filterVacations');
        commit('updateNotification', {ok: true, caption: 'Отпуск успешно удален'});
      }
    },
    async editVacation({commit, state}, vacation) {
      const result = await request('/vacation', 'PUT', {
        id: vacation.id,
        dateFrom: vacation.dateFrom,
        dateTo: vacation.dateTo
      }, true);
      if (result) {
        const updatedVacation = new Vacation(vacation);
        await updatedVacation.setFlag();
        commit('setVacations', [...state.vacations.filter(item => item.id !== vacation.id), ...[updatedVacation]]);
        commit('filterVacations');
        commit('updateNotification', {ok: result.ok, caption: result.caption});
      }
    },

    async sort({commit}, {sortField, sortOrder}) {
      console.log(sortField);
      console.log(sortOrder)
      commit('setSortField', sortField);
      commit('setSortOrder', sortOrder);
      commit('sortVacations');
    },
    async search({commit, dispatch}, input) {
      commit('setSearchValue', input);
      dispatch('applyFilters');
    },
    async filter({commit, dispatch}, status) {
      commit('setStatusValue', status);
      dispatch('applyFilters');
    },

    async applyFilters({commit}) {
      commit('filterVacations');
    }

  },
  state: {
    vacations: [],
    filteredVacations: [],
    filterOptions: {
      status: '',
      searchValue: '',
      searchField: 'countryName',
      sortField: 'countryName',
      sortOrder: 'ASC',
    }
  },
  mutations: {
    setVacations: (state, vacations) => state.vacations = vacations,
    setSortField: (state, field) => state.filterOptions.sortField = field,
    setSortOrder: (state, order) => state.filterOptions.sortOrder = order,
    setSearchValue: (state, input) => state.filterOptions.searchValue = input,
    setStatusValue: (state, status) => state.filterOptions.status = status,

    filterVacations(state) {
      const vacations = new FilterBuilder(state.filterOptions, [...state.vacations]);
      state.filteredVacations = vacations.search().filter().sort().get();
    },
    sortVacations(state) {
      const vacations = new FilterBuilder(state.filterOptions, [...state.filteredVacations]);
      state.filteredVacations = vacations.sort().get();
    }
  },
  getters: {
    getVacations(state) {
      return state.filteredVacations;
    },
    getOptions(state) {
      return state.filterOptions;
    },
    getSortField(state) {
      return state.filterOptions.sortField;
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
    this.status = this.calculateStatus();
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
  calculateStatus() {
    const dateFrom = new Date(this.dateFrom);
    const dateTo = new Date(this.dateTo);
    const now = new Date();
    const fromMs = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate(), 0, 0, 0, 0).valueOf();
    const toMs = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 0, 0, 0, 0).valueOf();
    const nowMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).valueOf();
    return (nowMs < fromMs) ? { text: 'Ожидание', class: 'success' } :
           (nowMs >= fromMs && nowMs < toMs) ? { text: 'В процессе', class: 'warning' } :
           { text: 'Завершен', class: 'danger' };
  }
}
