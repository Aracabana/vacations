export default {

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

export class FilterBuilder {
  constructor(options, data) {
    this.data = data;
    this.options = options;
  }

  search() {
    let { searchValue, searchField } = this.options;
    if (searchValue.trim() !== '') {
      searchValue = searchValue.toLowerCase();
      this.data = this.data.filter(item => item[searchField].toLowerCase().includes(searchValue));
      return this;
    }
  }

  sort() {
    this.data.sort(this.compareMethod);
    return this;
  }

  compareMethod(a,b) {
    const { sortField } = this.options;
    return (a[sortField] < b[sortField]) ? -1 : (a[sortField] > b[sortField]) ?  1 : 0;
  }

  get() {
    return this.data;
  }

}
