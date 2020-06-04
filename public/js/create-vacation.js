const vacationForm = document.querySelector('#vacation-form');
const dataList = document.querySelector('#countries-list');
const countryInput = document.querySelector('#country');
const spinner = document.querySelector('#spinner');
let map;
const mapOptions = {
    tilesUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    init: {
        maxZoom: 18
    }
}

window.onload = function() {
    countryInput.addEventListener('input', function () {
        const countryCode = checkExists(this.value);
        if(countryCode) {
            showCountryInfo(countryCode);
        }
    });
    vacationForm.addEventListener('submit', submitVacation);
    setDatePickersOptions();
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

async function showCountryInfo(countryCode) {
    const responseData = {
        searchField: 'isoAlpha3',
        value: countryCode
    }
    try {
        const response = await fetch('/api/getCountry', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(responseData)
        });
        const data = await response.json();
        if (data.ok) {
            try {
                const country = data.foundCountry;
                const response = await fetch(`https://restcountries.eu/rest/v2/alpha/${country.isoAlpha3}?fields=latlng`);
                if(response.status === 404) {
                    throw new Error('Карта для данной страны не найдена');
                }
                const { latlng } = await response.json();
                await setMap(latlng, country.isoAlpha3);
            } catch (err) {
                setServerFeedback({ ok: false, caption: err });
            }
        }

    } catch (err) {
        setServerFeedback({ ok: false, caption: err });
    }
}
async function setMap(latLng, countryCode) {
    if(map) {
        map.off();
        map.remove();
    }
    const url = `/api/getGeoJSON?countryCode=${countryCode.toUpperCase()}`;
    const response = await fetch(url);
    const geoJson = await response.json();
    map = L.map('map').setView(latLng, 3);
    L.tileLayer(mapOptions.tilesUrl, mapOptions.init).addTo(map);
    const f = L.geoJson(geoJson, {style: setStyle}).addTo(map);
    map.fitBounds(f.getBounds());
}

function checkExists(inputValue) {
    let countryCode = false;
    for (let i = 0; i < dataList.options.length; i++) {
        if(inputValue === dataList.options[i].value){
            countryCode = dataList.options[i].getAttribute('data-code');
            i = dataList.options.length;
        }
    }
    return countryCode;
}
function setStyle() {
    return {
        fillColor: '#FD8D3C',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}
