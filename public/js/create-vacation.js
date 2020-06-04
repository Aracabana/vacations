const vacationForm = document.querySelector('#vacation-form');
const spinner = document.querySelector('#spinner');

window.onload = function() {
    setDatePickersOptions();
    vacationForm.addEventListener('submit', submitVacation);
    setListeners(vacationForm);
}
async function submitVacation(e) {
    e.preventDefault();
    const error = validate(this);
    if (error) return;
    const country = document.getElementById('country').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const formData = {country, dateFrom, dateTo};
    spinner.hidden = false;
    try {
        const response = await fetch('/vacation', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        });
        if (response.redirected) {
            window.location.href = response.url;
            return;
        }
        const data = await response.json();
        setServerFeedback(data);
        setTimeout(() => {
            if (data.ok) {
                window.location.href = '/vacation/' + data.vacationId;
            }
        }, 2000);
    }
    catch (err) {
        setServerFeedback({ ok: false, caption: err });
    }
    finally {
        spinner.hidden = true;
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() < 10) ? '0'+(date.getMonth()+1) : date.getMonth();
    const day = (date.getDate() < 10) ? '0'+date.getDate() : date.getDate();
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
