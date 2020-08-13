
export default {
  install(Vue, options) {

    const formatter = new Intl.DateTimeFormat(undefined, options);

    Vue.filter('formatDatePicker', (value, increaseDays = 0) => {
      const date = new Date(value);
      date.setDate(date.getDate() + increaseDays);
      return formatter.format(date).split('.').reverse().join('-');
    });

    Vue.filter('formatVacationDates', (value) => {
      return formatter.format(value);
    });
  }
}
