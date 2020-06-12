function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() < 10) ? '0' + (date.getMonth() + 1) : date.getMonth();
    const day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
    return `${year}-${month}-${day}`;
}
function setDatePickersOptions() {
    const now = new Date();
    const vacationDateFrom = document.querySelector('#dateFrom');
    const vacationDateTo = document.querySelector('#dateTo');
    vacationDateFrom.min = formatDate(now);
    const minForDateTo = new Date();
    minForDateTo.setDate(minForDateTo.getDate() + 1);
    vacationDateTo.min = formatDate(minForDateTo);
}
