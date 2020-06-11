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
        const countryInfo = new CountryInfo(countryCode);
        try {
            await countryInfo.loadData(['latlng', 'languages']);
            await countryInfo.show();
        } catch (err) {
            setServerFeedback({ok: false, caption: err.message});
        }
        
    }
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


class CountryInfo extends Country {
    constructor(code) {
        super(code);
    }
    async show() {
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
            await map.load(mapWrapper);
        }
        catch (err) {
            throw err;
        }
    }
}

