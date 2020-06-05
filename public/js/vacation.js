const title = document.querySelector('#vacation-country');
const dates = document.querySelector('#vacation-dates');
const editVacationBtn = document.querySelector('#edit-vacation-btn');
const removeVacationBtn = document.querySelector('#remove-vacation-btn');

window.onload = async function() {
    const data = await loadVacation();
    const vacation = new VacationPage(data);
    vacation.init();
    console.log(vacation);
}

async function loadVacation() {
    try {
        const vacationId = window.location.pathname.split('/')[2];
        const url = `/api/getVacation?id=${vacationId}`;
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        if(!data.ok) {
            window.location.href = '/404';
            return;
        }
        return data.vacation;
    }
    catch (err) {
        setServerFeedback({ ok: false, caption: err });
    }
}

class VacationPage extends Vacation {
    constructor(vacation) {
        super(vacation);
    }

    renderInfo() {
        title.innerHTML = this.countryName;
        dates.innerHTML = `DateFrom: ${this.dateFrom} - DateTo: ${this.dateTo}`;
    }

    setListeners() {
        editVacationBtn.addEventListener('click', this.edit.bind(this));
        removeVacationBtn.addEventListener('click', this.remove.bind(this));
    }

    async remove() {
        const bool = confirm("Вы хотите удалить запись?");
        if (bool) {
            // spinner.hidden = false;
            const data = await super.remove();
            // setServerFeedback(data);
            if (data.ok) {
                window.location.href = '/';
            }
            // spinner.hidden = true;
        }
    }

    init() {
        this.renderInfo();
        this.setListeners();
    }
}