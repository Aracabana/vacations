import request from '../../utils/request';
import { FilterBuilder } from "../../utils/FilterBuilder";

export default {
  actions: {
    async loadVacations({commit, getters}) {
      const temp = [];
      const result = await request('/vacation');
      if (result) {
        const { vacations } = result;
        for (let i = 0; i < vacations.length; i++) {
          const vacation = new Vacation(vacations[i]);
          vacation.country = getters.getCountryById(vacation.countryId);
          vacation.countryName = vacation.country.countryName;
          temp.push(vacation);
        }
        commit('setVacations', temp);
        commit('filterVacations');
      }
    },
    async removeVacation({commit, state}, vacationId) {
      const result = await request('/vacation', 'DELETE', {id: vacationId});
      if (result) {
        commit('setVacations', state.vacations.filter(item => item.id !== vacationId));
        commit('filterVacations');
        commit('updateNotification', {page: 'Home', ok: true, caption: 'Отпуск успешно удален'});
      }
    },
    async editVacation({commit, state}, vacation) {
      const requestData = {
        id: vacation.id,
        dateFrom: vacation.dateFrom,
        dateTo: vacation.dateTo
      };
      const result = await request('/vacation', 'PUT', requestData, 'Popup');
      if (result) {
        const updatedVacation = new Vacation(vacation);
        await updatedVacation.setFlag();
        commit('setVacations', [...state.vacations.filter(item => item.id !== vacation.id), ...[updatedVacation]]);
        commit('filterVacations');
        commit('updatePopup', null);
        commit('updateNotification', {page: 'Home', ok: result.ok, caption: result.caption});
      }
    },

    async increaseVacationsCount({commit, state}) {
      const currVacationsCount = state.vacationFilterOptions.count;
      commit('setVacationRecordCount', currVacationsCount + 1);
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
      // commit('setVacationRecordCount', 1);
      commit('filterVacations');
    }
  },
  state: {
    vacations: [],
    filteredVacations: [],
    vacationFilterOptions: {
      status: '',
      searchValue: '',
      searchField: 'countryName',
      sortField: 'countryName',
      sortOrder: 'ASC',
      count: 1
    }
  },
  mutations: {
    setVacations: (state, vacations) => state.vacations = vacations,
    setVacationSortField: (state, field) => state.vacationFilterOptions.sortField = field,
    setVacationSortOrder: (state, order) => state.vacationFilterOptions.sortOrder = order,
    setVacationSearchValue: (state, input) => state.vacationFilterOptions.searchValue = input,
    setVacationStatusValue: (state, status) => state.vacationFilterOptions.status = status,
    setVacationRecordCount: (state, value) => state.vacationFilterOptions.count = value,

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
      return state.filteredVacations.filter((item, index) => index < state.vacationFilterOptions.count);
    },
    getVacationSortField(state) {
      return state.vacationFilterOptions.sortField;
    }
  }
}

class Vacation {
  constructor(vacation) {
    this.id = vacation.id;
    this.dateFrom = new Date(vacation.dateFrom);
    this.dateTo = new Date(vacation.dateTo);
    this.countryId = vacation.country_Id;
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
