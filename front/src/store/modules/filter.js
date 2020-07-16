// commit - вызывает mutations
// dispatch - вызывает actions


export default {
  actions: {

    sort({commit}, sortField) { // sort('dateFrom')
      commit('setSortField', sortField); // state.sortField = 'dateFrom' - mutation
      commit('sortVacations'); // сортирует массив на основе sortField
    },

    search({commit, dispatch}, input) { //search('aust')
      commit('setSearchValue', input); // state.searchValue = 'aust' - mutation
      dispatch('filter'); // вызывает Action 'filter' который в свою очередь вызывает mutation 'filterVacations' и сортирует
    },

    filter({commit}) {
      commit('filterVacations');   // производит поиск в массиве. Создает копию основного State.vacations.
                                   // И записывает её в State.filteredVacations
      commit('sortVacations'); // сортирует найденные элементы
    }

  },
  state: {
    // vacations: [],
    filteredVacations: [],
    filterOptions: {
      searchValue: '',
      searchField: 'countryName',
      sortField: 'countryName'
    }
  },
  mutations: {

    setSortField: (state, field) => state.filterOptions.sortField = field,
    setSearchValue: (state, input) => state.filterOptions.searchValue = input,
    setFilteredVacations: (state, vacations) => state.filteredVacations = vacations,

    filterVacations(state) {
      const temp = [...state.vacations];
      state.filteredVacations = temp;
      state.filteredVacations = x.filter(state.filterOptions, temp);
    },

    sortVacations(state) {
      const temp = [...state.filteredVacations];
      state.filteredVacations = x.sort(state.filterOptions.sortField, temp);
    }

  },
  getters: {}
}


const x = {
  filter: function(options, vacations) {
    let filteredVacations = [...vacations];

    // status

    // search
    if (options.searchValue.trim() !== '') {
      let searchValue = options.searchValue.toLowerCase();
      let searchField = options.searchField;
      filteredVacations = filteredVacations.filter(item => item[searchField].toLowerCase().includes(searchValue));
    }

    return filteredVacations;
  },
  sort: function(field, vacations) {
    const temp = [...vacations];
    function compare(a, b) {
      return (a[field] < b[field]) ? -1 : (a[field] > b[field]) ?  1 : 0;
    }
    return temp.sort(compare);
  }
}
