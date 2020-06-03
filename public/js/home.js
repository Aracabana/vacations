const serverFeedback = document.querySelector('#serverFeedback');
const vacationsTable = document.querySelector('#vacations-table');
const vacationsTableBody = document.querySelector('#vacations-table tbody');
const spinner = document.querySelector('#spinner');

window.onload = async function() {
    const vacations = new Vacations();
    spinner.hidden = false;
    try {
        await vacations.loadData();
        vacations.fillTable();
    }
    catch (err) {
        setError(err);
    }
    finally {
        spinner.hidden = true;
    }
    const byName = document.getElementById('byName');
    const byDateTo = document.getElementById('byDateTo');
    const byStatus = document.getElementById('byStatus');
    byName.addEventListener('click', async function () {
        vacationsTableBody.innerHTML = '';
        vacations.sortBy('countryName');
        vacations.fillTable();
    });
    byDateTo.addEventListener('click', async function () {
        vacationsTableBody.innerHTML = '';
        vacations.sortBy('dateTo');
        vacations.fillTable();
    });
    byStatus.addEventListener('click', async function () {
        vacationsTableBody.innerHTML = '';
        vacations.sortBy('status');
        vacations.fillTable();
    });
}

function setError(err) {
    serverFeedback.hidden = false;
    serverFeedback.innerText = err;
    setTimeout(() => {
        serverFeedback.hidden = true;
    }, 4000);
}

class Vacations {

    constructor() {
        this.storage = [];
    }

    async loadData() {
        try {
            const response = await fetch('/api/getVacations', {
                method: 'GET',
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'}
            });
            const result = await response.json();
            for (let i = 0; i < result.vacations.length; i++) {
                this.storage.push({
                    id: result.vacations[i].id,
                    countryName: result.vacations[i].countryName,
                    dateFrom: result.vacations[i].dateFrom,
                    dateTo: result.vacations[i].dateTo,
                    status: this.calculateStatus(result.vacations[i].dateFrom, result.vacations[i].dateTo)
                })
            }
        }
        catch (err) {
            throw err;
        }
    }
    filterBy(condition) {
        this.storage = this.storage.filter(condition);
    }
    sortBy(field) {
        function compare(a, b) {
            return (a[field] < b[field]) ? -1 : (a[field] > b[field]) ?  1 : 0
        }
        this.storage.sort(compare);
    }

    calculateStatus(dateFrom, dateTo) {
        const fromMs = new Date(dateFrom).valueOf();
        const toMs = new Date(dateTo).valueOf();
        const now = new Date();
        const nowMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        return (nowMs < fromMs) ? 'Ожидание' : (nowMs >= fromMs && nowMs < toMs) ? 'В процессе' : 'Завершен';
        // return {
        //     class: (nowMs < fromMs) ? 'success' : (nowMs >= fromMs && nowMs < toMs) ? 'warning' : 'danger',
        //     text: (nowMs < fromMs) ? 'Ожидание' : (nowMs >= fromMs && nowMs < toMs) ? 'В процессе' : 'Завершен'
        // }
    }
    formatDateCell(cell, date) {
        cell.classList.add('text-center');
        cell.innerText = new Date(date).toLocaleDateString();
    }
    formatStatusCell(cell, data ,status) {
        const span = document.createElement('span');
        span.classList.add('badge', `badge-${status}`);
        span.innerText = data;
        cell.appendChild(span);
    }
    renderEmptyRow() {
        const tr = document.createElement('tr');
        vacationsTableBody.appendChild(tr);
        const td = document.createElement('td');
        td.colSpan = 4;
        td.classList.add('text-center');
        td.innerText = 'У вас пока нет отпусков';
        tr.appendChild(td);
    }
    renderRow(vacation) {
        const tr = document.createElement('tr');
        vacationsTableBody.appendChild(tr);
        tr.addEventListener('click', function () {
            window.location.href = '/vacation/' + vacation.id;
        });
        const values = Object.values(vacation);
        for (let index = 1; index < values.length; index++) {
            const td = document.createElement('td');
            if(index === 1) {
                td.innerText = values[index].toString();
            }
            if (index === 2 || index === 3) {
                this.formatDateCell(td, values[index]);
            }
            if (index === 4) {
                // const {dateFrom, dateTo} = vacation;
                // const status = this.calculateStatus(dateFrom, dateTo);
                const status = (vacation.status === 'Ожидание') ? 'success' :
                               (vacation.status === 'В процессе') ? 'warning' : 'danger';
                this.formatStatusCell(td, values[index], status);
            }
            tr.appendChild(td);
        }
    }
    fillTable() {
        if(!this.storage.length) {
            this.renderEmptyRow();
            return;
        }
        for (let i = 0; i < this.storage.length; i++) {
            this.renderRow(this.storage[i]);
        }
    }
}
