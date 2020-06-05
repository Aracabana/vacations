window.onload = function() {
    const title = document.querySelector('#vacation-country');
    const dates = document.querySelector('#vacation-dates');
    const editVacationBtn = document.querySelector('#edit-vacation-btn');
    const removeVacationBtn = document.querySelector('#remove-vacation-btn');
    console.log(window.location);
    
}

async function loadVacation() {
    try {
        // const url = `/getVacation?id=${}`;
        const response = await fetch('/getVacation', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json'}
        });
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
}
