import Country from '../../../../public/js/entities/country-entity';
import request from '../../utils/request';

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
    }
  },
  state: {
    vacations: []
  },
  mutations: {
    updateVacations(state, vacations) {
      state.vacations = vacations;
    }
  },
  getters: {
    getVacations(state) {
      return state.vacations;
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

  async edit(dates) {
    try {
      const requestData = {
        id: this.id,
        dateFrom: dates.dateFrom,
        dateTo: dates.dateTo
      }
      const response = await fetch('/vacation', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestData)
      });
      if (response.redirected) {
        window.location.href = response.url;
      }
      const data = await response.json();
      if (!data.ok) {
        throw new Error(data.caption);
      }
      const vacation = data.vacation;
      this.dateFrom = new Date(vacation.dateFrom).toLocaleDateString();
      this.dateTo = new Date(vacation.dateTo).toLocaleDateString();
      this.status = Vacation.calculateStatus(vacation.dateFrom, vacation.dateTo);
      return {ok: data.ok, caption: data.caption};
    } catch (err) {
      return {ok: false, caption: err.message};
    }
  }
}
