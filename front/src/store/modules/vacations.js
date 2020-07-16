import Country from '../../../../public/js/entities/country-entity';
import request from '../../utils/request';
import filter from './filter';

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
      commit('updateVacations', tmp);
      // commit('updateFilteredVacations', tmp);
    },
    async removeVacation({commit, state}, vacationId) {
      try {
        const result = await request('/vacation', 'DELETE', {id: vacationId});
        if (result.ok) {
          commit('updateVacations', state.vacations.filter(item => item.id !== vacationId));
          commit('updateNotification', {ok: true, caption: 'Отпуск успешно удален'});
        }
      } catch (err) {
        commit('updateNotification', {ok: false, caption: 'Вутрення ошибка сервера'});
      }
    },
    async editVacation({commit, state}, vacation) {
      try {
        const requestData = {
          id: vacation.id,
          dateFrom: vacation.dateFrom,
          dateTo: vacation.dateTo
        }
        const result = await request('/vacation', 'PUT', requestData);

        if (!result.ok) {
          throw new Error(result.caption);
        }

        const updatedVacation = new Vacation(vacation);
        await updatedVacation.setFlag();
        commit('updateVacations', [...state.vacations.filter(item => item.id !== vacation.id), ...[updatedVacation]]);
        commit('updateNotification', {ok: result.ok, caption: result.caption});

      } catch (err) {
        commit('updateNotification', {ok: false, caption: err.message});
      }
    },

    // filterBy({commit, state}, {field, value}) {
    //   let filteredVacations = state.vacations.filter(item => item[field].toLowerCase().includes(value.toLowerCase()));
    //   commit('updateFilteredVacations', filteredVacations);
    // },

    // sortBy({commit, state}, field) {
    //   function compare(a,b) {
    //     return (a[field] < b[field]) ? -1 : (a[field] > b[field]) ?  1 : 0;
    //   }
    //   const sorted = state.filteredVacations.sort(compare);
    //   commit('updateFilteredVacations', sorted);
    // }
  },
  state: {
    vacations: []
  },
  mutations: {
    updateVacations(state, payload) {
      state.vacations = payload;
    },
    // updateFilteredVacations(state, payload) {
    //   state.filteredVacations = payload;
    // }

  },
  getters: {
    getVacations(state) {
      return state.filteredVacations;
    }
  },
   modules: {filter}
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
