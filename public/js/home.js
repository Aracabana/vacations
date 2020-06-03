window.onload = function() {
    const vacationsTable = document.querySelector('#vacations-table');
    const vacationsTableBody = document.querySelector('#vacations-table tbody');
    getVacations(vacationsTableBody);

}

async function getVacations(tableBody) {
    try {
        const response = await fetch('/vacation/all', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data);
        fillTableBy(data, tableBody);
    }
    catch (err) {
        console.log(err);
    }
}
function fillTableBy(data, tableBody) {
    const vacations = data.vacations;
    console.log(vacations);
    if (!vacations) {
        const tr = document.createElement('tr');
        tableBody.appendChild(tr);
        const td = document.createElement('td');
        td.colSpan = 4;
        td.classList.add('text-center');
        td.innerText = 'У вас пока нет отпусков';
        tr.appendChild(td);
        return false;
    }
    for (let i = 0; i < vacations.length; i++) {
        const tr = document.createElement('tr');
        tableBody.appendChild(tr);
        tr.addEventListener('click', function () {
            // редирект на страницу отпуска
        });
        const tdCountryName = document.createElement('td');
        tdCountryName.innerText = vacations[i].countryName;
        tr.appendChild(tdCountryName);
        const tdDateFrom = document.createElement('td');
        tdDateFrom.classList.add('text-center');
        tdDateFrom.innerText = new Date(vacations[i].dateFrom).toLocaleDateString();
        tr.appendChild(tdDateFrom);
        const tdDateTo = document.createElement('td');
        tdDateTo.classList.add('text-center');
        tdDateTo.innerText = new Date(vacations[i].dateTo).toLocaleDateString();
        tr.appendChild(tdDateTo);
        const tdStatus = document.createElement('td');
        tr.appendChild(tdStatus);
        const status = document.createElement('span');
        // добавить разные классы (цвета) для разных статусов
        status.classList.add('badge', 'badge-success');
        status.innerText = vacations[i].status;
        tdStatus.appendChild(status);
    }
}
