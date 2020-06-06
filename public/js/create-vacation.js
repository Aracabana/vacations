const vacationForm = document.querySelector('#vacation-form');
const dataList = document.querySelector('#countries-list');
const countryInput = document.querySelector('#country');
const spinner = document.querySelector('#spinner');
const mapWrapper = document.querySelector('#map-wrapper');

const countryInfo = document.querySelector('#country-info');
const countryName = document.querySelector('#name');
const countryCapital = document.querySelector('#capital');
const countryArea = document.querySelector('#area');
const countryPopulation = document.querySelector('#population');
const countryLanguages = document.querySelector('#languages-wrapper');

let map;
const mapOptions = {
    tilesUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    init: {
        maxZoom: 18
    }
}

window.onload = function() {
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
    }
    catch (err) {
        setServerFeedback({ ok: false, caption: err });
    }
    finally {
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

// async function showCountryInfo(countryCode) {
//     const responseData = {
//         searchField: 'isoAlpha3',
//         value: countryCode
//     }
//     try {
//         const response = await fetch('/api/getCountry', {
//             method: 'POST',
//             credentials: 'same-origin',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify(responseData)
//         });
//         const data = await response.json(); //geonames object
//         if (data.ok) {
//             try {
//                 const country = data.foundCountry;
//                 const countryAdditionalInfo = await getAdditionalInfo(countryCode);
//                 // setCountryInfo(country, countryAdditionalInfo);
//                 mapWrapper.hidden = true;
//                 if (countryAdditionalInfo) {
//                     await setMap(countryCode, countryAdditionalInfo.latlng);
//                 }
//             } catch (err) {
//                 setServerFeedback({ ok: false, caption: err.message });
//             }
//         }
//
//     } catch (err) {
//         setServerFeedback({ ok: false, caption: err.message });
//     }
// }
// async function getAdditionalInfo(countryCode) {
//     try {
//         const response = await fetch(`https://restcountries.eu/rest/v2/alpha/${countryCode}?fields=latlng;languages`);
//         if (response.status === 404) {
//             throw new Error('Не удалось загрузить дополнительную информацию');
//         }
//         const { latlng, languages } = await response.json();
//         return { latlng, languages};
//     } catch (err) {
//         return false;
//     }
// }
// function setCountryLanguages(languages) {
//     countryLanguages.innerText = '';
//     languages.forEach(item => {
//         countryLanguages.innerHTML += `<span>${item.name}</span>`;
//     });
// }
// function setCountryInfo(country, countryAdditionalInfo) {
//     const countryInfo = document.querySelector('#country-info');
//     const countryName = document.querySelector('#name');
//     const countryCapital = document.querySelector('#capital');
//     const countryArea = document.querySelector('#area');
//     const countryPopulation = document.querySelector('#population');
//     const countryLanguages = document.querySelector('#languages-wrapper');
//     countryInfo.hidden = false;
//     countryLanguages.hidden = true;
//     countryName.innerText = country.countryName;
//     countryCapital.innerText = country.capital;
//     countryArea.innerHTML = country.areaInSqKm + ' км <sup>2</sup>';
//     countryPopulation.innerText = country.population;
//     if (countryAdditionalInfo) {
//         countryLanguages.hidden = false;
//         setCountryLanguages(countryAdditionalInfo.languages);
//     }
// }

async function setMap(countryCode, latlng) {
    if (map) {
        map.off();
        map.remove();
        map = null;
    }
    try {
        mapWrapper.hidden = false;
        map = L.map('map').setView(latlng, 3);
        L.tileLayer(mapOptions.tilesUrl, mapOptions.init).addTo(map);
        const url = `/api/getGeoJSON?countryCode=${countryCode.toUpperCase()}`;
        const responsePolygon = await fetch(url);
        if (responsePolygon.status === 500) {
            throw new Error('Границы для данной страны не найдены');
        }
        const geoJson = await responsePolygon.json();
        const f = L.geoJson(geoJson, {style: setStyle}).addTo(map);
        map.fitBounds(f.getBounds());
    } catch (err) {
        throw err;
    }
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
                countryInfo.hidden = true;
                throw new Error(data.caption);
            }
            this.data = data.foundCountry;

            await this.loadAdditionalData(['latlng', 'languages']);
        } catch (err) {
            setServerFeedback({ ok: false, caption: err.message });
        }
    }
    async loadAdditionalData(fieldsArray) {
        const joinedFields = fieldsArray.join(';');
        const response = await fetch(`https://restcountries.eu/rest/v2/alpha/${this.code}?fields=${joinedFields}`);
        if (response.status === 404) {
            countryLanguages.hidden = true;
            throw new Error('Не удалось загрузить дополнительную информацию');
        }
        const data = await response.json();
        this.data.additional = data;
    }

    showInfo() {
        if (this.data) {
            countryInfo.hidden = false;
            countryName.innerText = this.data.countryName;
            countryCapital.innerText = this.data.capital;
            countryArea.innerHTML = this.data.areaInSqKm + ' км <sup>2</sup>';
            countryPopulation.innerText = this.data.population;
            if (this.data.additional) {
                countryLanguages.hidden = false;
                countryLanguages.innerText = '';
                this.data.additional.languages.forEach(item => {
                    countryLanguages.innerHTML += `<span>${item.name}</span>`;
                });
            }
        }
    }
}