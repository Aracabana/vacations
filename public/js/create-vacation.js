const vacationForm = document.querySelector('#vacation-form');
const dataList = document.querySelector('#countries-list');
const countryInput = document.querySelector('#country');
const spinner = document.querySelector('#spinner');
const countryInfo = document.querySelector('#country-info');
const countryName = document.querySelector('#name');
const countryCapital = document.querySelector('#capital');
const countryArea = document.querySelector('#area');
const countryPopulation = document.querySelector('#population');
const countryLanguagesWrapper = document.querySelector('#languages-wrapper');
const countryLanguages = document.querySelector('#languages');
const mapWrapper = document.querySelector('#map-wrapper');

window.onload = function () {
    countryInput.addEventListener('input', selectCountry);
    vacationForm.addEventListener('submit', submitVacation);
    setDatePickersOptions();
    setValidateListeners(vacationForm);
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
    } catch (err) {
        setServerFeedback({ok: false, caption: err});
    } finally {
        spinner.hidden = true;
    }
}
async function selectCountry() {
    const countryCode = checkExists(this.value);
    if (countryCode) {
        const country = new Country(countryCode);
        await country.loadData();
        country.showInfo();
    }
}
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
function checkExists(inputValue) {
    let countryCode = false;
    for (let i = 0; i < dataList.options.length; i++) {
        if (inputValue === dataList.options[i].value) {
            countryCode = dataList.options[i].getAttribute('data-code');
            i = dataList.options.length;
        }
    }
    return countryCode;
}

class Country {
    constructor(code) {
        this.data = '';
        this.code = code;
    }
    async loadData() {
        const requestBody = {
            searchField: 'isoAlpha3',
            value: this.code
        }
        try {
            const response = await fetch('/api/getCountry', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(requestBody)
            });
            const data = await response.json(); // geonames object
            if (!data.ok) {
                throw new Error(data.caption);
            }
            this.data = data.foundCountry;
            await this.loadAdditionalData(['latlng', 'languages']);
        } catch (err) {
            setServerFeedback({ok: false, caption: err.message});
        }
    }
    async loadAdditionalData(fieldsArray) {
        const joinedFields = fieldsArray.join(';');
        const response = await fetch(`https://restcountries.eu/rest/v2/alpha/${this.code}?fields=${joinedFields}`);
        if (response.status === 404) {
            throw new Error('Не удалось загрузить дополнительную информацию (карту и языки)');
        }
        this.data.additional = await response.json();
    }
    async showInfo() {
        countryInfo.hidden = true;
        countryLanguagesWrapper.hidden = true;
        mapWrapper.hidden = true;
        if (this.data) {
            countryInfo.hidden = false;
            countryName.innerText = this.data.countryName;
            countryCapital.innerText = this.data.capital;
            countryArea.innerHTML = this.data.areaInSqKm + ' км <sup>2</sup>';
            countryPopulation.innerText = this.data.population;
            if (this.data.additional) {
                this.showLanguages();
                await this.showMap();
            }
        }
    }
    showLanguages() {
        countryLanguagesWrapper.hidden = false;
        countryLanguages.innerText = '';
        this.data.additional.languages.forEach(item => {
            countryLanguages.innerHTML += `<span>${item.name}</span>`;
        });
    }
    async showMap() {
        mapWrapper.innerHTML = '<div id="map"></div>';
        const map = new Map(this.data.additional.latlng, this.data.isoAlpha3);
        try {
            await map.load();
        }
        catch (err) {
            setServerFeedback({ok: false, caption: err.message});
        }
    }
}
class Map {
    constructor(latlng, countryCode) {
        this.countryCode = countryCode;
        this.latlng = latlng;
        this.map = '';
        this.styles = {
            fillColor: '#FD8D3C',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
        this.options = {
            tilesUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            init: {
                maxZoom: 18
            }
        }
    }
    async load() {
        try {
            mapWrapper.hidden = false;
            this.map = L.map('map').setView(this.latlng, 6);
            L.tileLayer(this.options.tilesUrl, this.options.init).addTo(this.map);
            const url = `/api/getGeoJSON?countryCode=${this.countryCode.toUpperCase()}`;
            const responsePolygon = await fetch(url);
            if (responsePolygon.status === 500) {
                throw new Error('Границы для данной страны не найдены');
            }
            const geoJson = await responsePolygon.json();
            const f = L.geoJson(geoJson, {style: this.styles}).addTo(this.map);
            this.map.fitBounds(f.getBounds());
        } catch (err) {
            throw err;
        }
    }
}
