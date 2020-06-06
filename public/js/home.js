const serverFeedback = document.querySelector('#serverFeedback');
const vacationsTableBody = document.querySelector('#vacations-table tbody');
const byName = document.getElementById('byName');
const byDateTo = document.getElementById('byDateTo');
const byStatus = document.getElementById('byStatus');
const search = document.getElementById('search');
const spinner = document.querySelector('#spinner');

window.onload = async function() {
    const table = new VacationsTable();
    spinner.hidden = false;
    try {
        await table.loadData();
        table.fill();
    } catch (err) {
        setServerFeedback({ok: false, caption: err});
    } finally {
        spinner.hidden = true;
    }
    byName.addEventListener('click', table.sortBy.bind(table, 'countryName'));
    byDateTo.addEventListener('click', table.sortBy.bind(table, 'dateTo'));
    byStatus.addEventListener('click', table.sortBy.bind(table, 'status'));
    search.addEventListener('input', function () {
        table.filterBy( 'countryName', this.value);
    });
}

function setServerFeedback(data, time = 4000) {
    serverFeedback.classList.remove('alert-success', 'alert-danger');
    serverFeedback.classList.add(data.ok ? 'alert-success' : 'alert-danger');
    serverFeedback.hidden = false;
    serverFeedback.innerText = data.caption;
    setTimeout(() => {
        serverFeedback.hidden = true;
    }, time)
}

class Vacations {
    constructor() {
        this.storage = [];
        this.tmpStorage = [];
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
                const vacation = new Vacation(result.vacations[i]);
                await vacation.setFlag();
                this.storage.push(vacation);
            }
        }
        catch (err) {
            throw err;
        }
    }
    filterBy(field, value) {
        if (!this.tmpStorage.length) {
            this.tmpStorage = this.storage.slice();
        }
        if (!value) {
            this.storage = this.tmpStorage.slice();
            this.tmpStorage.length = 0;
            return;
        }
        value = value.toLowerCase();
        this.storage = this.tmpStorage.filter(x => x[field].toLowerCase().includes(value));
    }
    sortBy(field) {
        function compare(a, b) {
            return (a[field] < b[field]) ? -1 : (a[field] > b[field]) ?  1 : 0;
        }
        this.storage.sort(compare);
    }
    removeFromStorage(vacation) {
        if(this.tmpStorage.length) {
            const index = this.tmpStorage.indexOf(vacation);
            this.tmpStorage.splice(index, 1);
        }
        const index = this.storage.indexOf(vacation);
        this.storage.splice(index, 1);
    }
}

class VacationsTable extends Vacations {
    constructor() {
        super();
    }

    sortBy(field) {
        super.sortBy(field);
        this.fill();
    }
    filterBy(field, value) {
        super.filterBy(field, value);
        this.fill();
    }

    formatNameCell(cell, vacation) {
        if (vacation.flag) {
            const flagImg = document.createElement('img');
            flagImg.classList.add('flag');
            flagImg.src = vacation.flag;
            cell.appendChild(flagImg);
        }
        const name = document.createElement('span');
        name.innerText = vacation.countryName;
        cell.appendChild(name);
    }
    formatDateCell(cell, date) {
        cell.classList.add('text-center');
        cell.innerText = date
    }
    formatStatusCell(parent, data ,status) {
        const span = document.createElement('span');
        span.classList.add('badge', `badge-${status}`);
        span.innerText = data;
        parent.appendChild(span);
    }
    createActionCell(parent, vacation) {
        const td = document.createElement('td');
        td.classList.add('action-td');
        this.createActionBlock(td, vacation);
        parent.appendChild(td);
    }
    createActionBlock(parent, vacation) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('action-block');

        const edit = this.createActionItem(['fa-pen', 'text-warning']);
        edit.addEventListener('click', function () {
            // window.location.href = '/vacation/' + vacation.id;
        });
        wrapper.appendChild(edit);

        const remove = this.createActionItem(['fa-trash-alt', 'text-danger']);
        remove.addEventListener('click', async () => {
            const bool = confirm("Вы хотите удалить запись?");
            if (bool) {
                spinner.hidden = false;
                const data = await vacation.remove();
                setServerFeedback(data);
                if (data.ok) {
                    this.removeFromStorage(vacation);
                    this.fill();
                }
                spinner.hidden = true;
            }
        });
        wrapper.appendChild(remove);

        parent.appendChild(wrapper);
    }
    createActionItem(actionClass) {
        const actionBtn = document.createElement('button');
        actionBtn.classList.add('btn');
        const actionBtnItem = document.createElement('i');
        actionBtn.appendChild(actionBtnItem);
        actionBtn.classList.add('fas', ...actionClass);
        return actionBtn;
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
        tr.classList.add('table-row');
        tr.addEventListener('click', function () {
            window.location.href = '/vacation/' + vacation.id;
        });
        vacationsTableBody.appendChild(tr);

        const values = vacation.getFieldsArray();
        for (let index = 0; index < values.length; index++) {
            const td = document.createElement('td');
            if (!index) {
                this.formatNameCell(td, vacation);
            }
            if (index === 1 || index === 2) {
                this.formatDateCell(td, values[index]);
            }
            if (index === 3) {
                const status = vacation.getStatusClass();
                this.formatStatusCell(td, values[index], status);
            }
            tr.appendChild(td);
        }
        
        this.createActionCell(tr, vacation);
    }

    fill() {
        vacationsTableBody.innerHTML = '';
        if (!this.storage.length) {
            this.renderEmptyRow();
            return;
        }
        for (let i = 0; i < this.storage.length; i++) {
            this.renderRow(this.storage[i]);
        }
    }
}
