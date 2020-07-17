export function formatDate (date) {
  const year = date.getFullYear()
  const month = (date.getMonth() < 10) ? '0' + (date.getMonth() + 1) : date.getMonth()
  const day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate()
  return `${year}-${month}-${day}`
}

export function validateDates() {
  console.log(this);
  return true;
  // const valueOfDateFrom = new Date(dateFrom).valueOf();
  // const valueOfDateTo = new Date(dateTo).valueOf();
  // const now = new Date();
  // const nowUTC0 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  // const tomorrow = nowUTC0.valueOf() + (24 * 60 * 60 * 1000);
  // if (valueOfDateFrom >= valueOfDateTo) {
  //   return false;
  // }
  // if (valueOfDateFrom < nowUTC0 || valueOfDateTo < tomorrow) {
  //   return false;
  // }
  // return true;
}
