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

  filter() {
    let { status } = this.options;
    if (status.trim() !== '') {
      this.data = this.data.filter(item => item.status.text === status);
    }
    return this;
  }

  sort() {
    const { sortField, sortOrder } = this.options;
    let sign = (sortOrder === 'ASC') ? 1 : -1;
    this.data.sort((a,b) => {
      return (a[sortField] < b[sortField]) ? -1 * sign : (a[sortField] > b[sortField]) ? sign : 0;
    });
    return this;
  }

  get() {
    return this.data;
  }

}
