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
    }
    return this;
  }

  sort() {
    const { sortField } = this.options;
    this.data.sort((a,b) => {
      return (a[sortField] < b[sortField]) ? -1 : (a[sortField] > b[sortField]) ?  1 : 0;
    });
    return this;
  }

  get() {
    return this.data;
  }

}
