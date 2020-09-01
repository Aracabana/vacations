import request from '../../utils/request';
import { FilterBuilder } from "../../utils/FilterBuilder";
import router from '../../router';

export default {
  state: {
    vacations: [],
    filteredVacations: [],
    vacationFilterOptions: {
      status: '',
      searchValue: '',
      searchField: 'countryName',
      sortField: 'countryName',
      sortOrder: 'ASC'
    }
  },
  actions: {
    async loadVacations({commit, getters}) {
      const temp = [];
      const result = await request('/vacation');
      if (result) {
        const { vacations } = result;
        for (let i = 0; i < vacations.length; i++) {
          const countryOfVacation = getters.getCountryById(vacations[i].country_Id);
          const vacation = new Vacation(vacations[i], countryOfVacation);
          temp.push(vacation);
        }
        commit('setVacations', temp);
        commit('filterVacations');
      }
    },
    async addVacation({commit, getters, state}, formData) {
      const response = await request('/vacation', 'POST', formData);
      if (response.ok) {
        const countryOfVacation = getters.getCountryById(response.vacation.country_Id);
        const vacation = new Vacation(response.vacation, countryOfVacation);
        commit('setVacations', [...state.vacations, vacation]);
        commit('filterVacations');
        commit('updateNotification', {...response, page: router.currentRoute.name})
        return vacation.id;
      }
      return false;
    },
    async removeVacation({commit, state}, vacationId) {
      const result = await request('/vacation', 'DELETE', {id: vacationId});
      if (result) {
        commit('setVacations', state.vacations.filter(item => item.id !== vacationId));
        commit('filterVacations');
        commit('updateNotification', {page: router.currentRoute.name, ok: true, caption: 'Отпуск успешно удален'});
        return true;
      }
      return false;
    },
    async editVacation({commit, state, getters}, vacation) {
      const requestData = {
        id: vacation.id,
        dateFrom: vacation.dateFrom,
        dateTo: vacation.dateTo
      };
      const result = await request('/vacation', 'PUT', requestData, 'Popup');
      if (result) {
        const countryOfVacation = getters.getCountryById(vacation.country_Id);
        const updatedVacation = new Vacation(vacation, countryOfVacation);
        commit('setVacations', [...state.vacations.filter(item => item.id !== vacation.id), updatedVacation]);
        commit('filterVacations');
        commit('updateNotification', {page: router.currentRoute.name, ok: result.ok, caption: result.caption});
      }
      return result;
    },

    async sortVacation({commit}, {sortField, sortOrder}) {
      commit('setVacationSortField', sortField);
      commit('setVacationSortOrder', sortOrder);
      commit('sortVacations');
    },
    async searchVacation({commit, dispatch}, input) {
      commit('setVacationSearchValue', input);
      dispatch('applyVacationFilters');
    },
    async filterVacation({commit, dispatch}, status) {
      commit('setVacationStatusValue', status);
      dispatch('applyVacationFilters');
    },

    async applyVacationFilters({commit}) {
      commit('filterVacations');
    }
  },
  mutations: {
    setVacations: (state, vacations) => state.vacations = vacations,
    setVacationSortField: (state, field) => state.vacationFilterOptions.sortField = field,
    setVacationSortOrder: (state, order) => state.vacationFilterOptions.sortOrder = order,
    setVacationSearchValue: (state, input) => state.vacationFilterOptions.searchValue = input,
    setVacationStatusValue: (state, status) => state.vacationFilterOptions.status = status,

    filterVacations(state) {
      const vacations = new FilterBuilder(state.vacationFilterOptions, [...state.vacations]);
      state.filteredVacations = vacations.search().filter().sort().get();
    },
    sortVacations(state) {
      const vacations = new FilterBuilder(state.vacationFilterOptions, [...state.filteredVacations]);
      state.filteredVacations = vacations.sort().get();
    }
  },
  getters: {
    getVacations(state) {
      return state.filteredVacations;
    },
    getVacationById: state => id => {
      return state.vacations.find(vacation => vacation.id === Number(id));
    },
    getVacationSortField(state) {
      return state.vacationFilterOptions.sortField;
    }
  }
}

class Vacation {
  constructor(vacation, country) {
    this.id = vacation.id;
    this.dateFrom = new Date(vacation.dateFrom);
    this.dateTo = new Date(vacation.dateTo);
    this.country_Id = vacation.country_Id;
    this.country = country;
    this.countryName = country.countryName;
    this.status = this.calculateStatus();
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
