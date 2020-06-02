window.onload = function() {
    const vacationDateFrom = document.querySelector('#dateFrom');
    vacationDateFrom.min = new Date().toISOString().split("T")[0];
    const vacationDateTo = document.querySelector('#dateTo');
    const minDateTo = new Date();
    minDateTo.setDate(minDateTo.getDate() + 1);
    vacationDateTo.min = minDateTo.toISOString().split("T")[0];
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
    }
    catch (err) {
        console.log(err);
    }
}
