window.onload = function() {
    setDatePickersOptions();
    const vacationForm = document.querySelector('#vacation-form');
    vacationForm.addEventListener('submit', submitVacation);
    // setListeners(vacationForm);
}
async function submitVacation(e) {
    e.preventDefault();
    const country = document.getElementById('country').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const formData = {country, dateFrom, dateTo};
    console.log(formData);
    try {
        const response = await fetch('/vacation', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        console.log(data);
        const serverFeedback = setServerFeedback(data);
        setTimeout(() => {
            if (data.ok) {
                // window.location.href = '';
                return;
            }
            serverFeedback.hidden = true;
        }, 2000);
    }
    catch (err) {
        console.log(err);
    }
}

function setDatePickersOptions() {
    const vacationDateFrom = document.querySelector('#dateFrom');
    const vacationDateTo = document.querySelector('#dateTo');
    vacationDateFrom.min = new Date().toISOString().split("T")[0];
    const minForDateTo = new Date();
    minForDateTo.setDate(minForDateTo.getDate() + 1);
    vacationDateTo.min = minForDateTo.toISOString().split("T")[0];
}
function setServerFeedback(data) {
    const serverFeedback = document.querySelector('#serverFeedback');
    serverFeedback.classList.remove('alert-success', 'alert-danger');
    serverFeedback.classList.add(data.ok ? 'alert-success' : 'alert-danger');
    serverFeedback.hidden = false;
    serverFeedback.innerText = data.caption;
    return serverFeedback;
}
