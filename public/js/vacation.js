const title = document.querySelector('#vacation-country');
const dates = document.querySelector('#vacation-dates');
const editVacationBtn = document.querySelector('#edit-vacation-btn');
const removeVacationBtn = document.querySelector('#remove-vacation-btn');
const widgetsWrapper = document.querySelector('#widgets-wrapper');
const widgetsSidebar = document.querySelector('#widgets-sidebar');

window.onload = async function() {
    const id = window.location.pathname.split('/')[2];
    const vacation = await loadVacationByID(id);
    const page = new VacationPage(vacation);
    try {
        await page.setCountryData();
    }  finally {
        await page.init();
    }
}

async function loadVacationByID(id) {
    try {
        const url = `/api/getVacation?id=${id}`;
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
        this.widgets = [];
    }

    renderInfo() {
        if (this.countryInfo.additional) {
            const flagImg = document.createElement('img');
            flagImg.classList.add('flag');
            flagImg.src = this.countryInfo.additional.flag;
            title.appendChild(flagImg);
        }
        const name = document.createElement('span');
        name.innerText = this.countryName;
        title.appendChild(name);
        dates.innerHTML = `${this.dateFrom} - ${this.dateTo}`;
    }
    
    async loadWidgets() {
        try {
            const url = `/api/widgets?vacationId=${this.id}`;
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'}
            });
            const data = await response.json();
            if (data.ok) {
                console.log(data);
                data.widgets.forEach(item => {
                    let widget;
                    if (item.id === 1) {
                        item.additional = this.countryInfo.additional;
                        widget = new TimeWidget(item, this.id);
                        widget.init();
                    }
                    if (item.id === 2) {
                        item.additional = this.countryInfo.additional;
                        widget = new WeatherWidget(item, this.id);
                        widget.init();
                    }
                    if (item.id === 3) {
                        item.info = this.countryInfo;
                        widget = new InfoWidget(item, this.id);
                        widget.init();
                    }
                    if (item.id === 4) {
                        widget = new BudgetWidget(item, this.id);
                        widget.init();
                    }
                    this.widgets.push(widget);
                });
            }
            console.log(this.widgets);
        }
        catch (err) {
            setServerFeedback({ ok: false, caption: err.message });
        }
    }

    setListeners() {
        editVacationBtn.addEventListener('click',  () => {
            console.log(this);
            editPopup('edit-popup', this, () => {
                dates.innerHTML = `${this.dateFrom} - ${this.dateTo}`;
            });
        });
        removeVacationBtn.addEventListener('click', () => {
            this.remove.bind(this);
        });
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

    async init() {
        this.renderInfo();
        await this.loadWidgets();
        if (this.status !== 'Завершен') {
            this.setListeners();
        }
        else {
            editVacationBtn.remove();
            removeVacationBtn.remove();
        }
    }
}

class Widget {
    constructor(widgetData, vacationId) {
        this.id = widgetData.id;
        this.name = widgetData.name;
        this.vacationId = vacationId;
        this.isActive = widgetData.isActive;
        this.spinner = '';
        this.widgetCardWrapper = '';
        this.widgetCardClasses = ['col-12', 'col-md-6', 'col-lg-3'];
        this.body = '';
        this.headerControls = [
            {classes: [ 'fa-expand-alt', 'text-secondary'], action: this.expand},
            {classes: [ 'fa-cog', 'text-secondary'], action: this.showOptions},
            {classes: ['fa-trash-alt', 'text-danger']}
        ];
        this.requestLoader = false;
    };
    
    showOptions() {
        console.log(this.id);
    }
    expand() {
        console.log('expand');
    }
    
    async sendRequest(url, method, additionalData = undefined) {
        if (!this.requestLoader) {
            this.requestLoader = true;
            try {
                const responseData = {
                    widgetId: this.id,
                    vacationId: this.vacationId,
                    data: additionalData
                };
                const response = await fetch(url, {
                    method: method,
                    credentials: 'same-origin',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(responseData)
                });
                if (response.redirected) {
                    window.location.href = response.url;
                }
                const data = await response.json();
                if (!data.ok) {
                    throw new Error(data.caption);
                }
                return true;
            } catch (err) {
                setServerFeedback({ok: false, caption: err.message});
            } finally {
                this.requestLoader = false;
            }
        }
        return false;
    }
    
    async removeFromDashboard() {
        const result = await this.sendRequest('/api/widgets', 'DELETE');
        if (result) {
            this.widgetCardWrapper.remove();
            this.widgetCardWrapper = '';
            this.body = '';
            this.isActive = false;
        }
        return result;
    }
    async addToDashboard(li) {
        const result = await this.sendRequest('/api/widgets', 'POST');
        if (result) {
            li.remove();
            this.isActive = true;
        }
        return result;
    }
    
    renderControl() {
        const li = document.createElement('li');
        li.classList.add('widget-menu-item', 'text-white');
        const span = document.createElement('span');
        span.innerText = this.name;
        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn-light', 'btn-sm');
        const i = document.createElement('i');
        i.classList.add('fas', 'fa-plus');
        btn.append(i);
        return {btn, span, li};
    }
    renderHeader() {
        const header = document.createElement('div');
        header.classList.add('card-header', 'widget-header');
        
        const headerTitle = document.createElement('span');
        headerTitle.innerText = this.name;
        header.appendChild(headerTitle);
        
        const headerControls = document.createElement('div');
        headerControls.classList.add('widget-controls');
        
        this.headerControls.forEach(item => {
            const btn = document.createElement('button');
            btn.classList.add('btn', 'btn-sm');
            const btnIcon = document.createElement('i');
            btnIcon.classList.add('fas', ...item.classes);
            btn.addEventListener('click', async () => {
                await item.action.call(this);
            });
            btn.appendChild(btnIcon);
            headerControls.appendChild(btn);
        });
        
        header.appendChild(headerControls);
        this.widgetCard.appendChild(header);
    }
    renderBody() {
        this.body = document.createElement('div');
        this.body.classList.add('card-body');
        this.widgetCard.appendChild(this.body);
    }
    renderEmptyWidgetContent() {
        const err = document.createElement('p');
        err.innerHTML = this.data;
        err.classList.add('empty-widget');
        this.body.append(err);
    }

    createSpinner() {
        this.spinner = document.createElement('div');
        this.spinner.classList.add('spinner-wrapper');
        this.spinner.hidden = true;
        const spinnerBody = document.createElement('div');
        spinnerBody.classList.add('spinner-border', 'text-success');
        const span = document.createElement('span');
        span.classList.add('sr-only');
        span.innerText = 'Loading...';
        spinnerBody.append(span);
        this.spinner.append(spinnerBody);
        this.widgetCardWrapper.append(this.spinner);
    }

    async setData(url = undefined) {
        if (!url) {
            this.data = '<i class="far fa-2x fa-sad-tear"></i> ' +
                '<span>Не удалось получить данные для виджета</span>';
            return;
        }
        let data;
        try {
            data = await this.loadData(url);
            if (typeof data === 'string') {
                throw new Error(data);
            }
        } catch (err) {
            data = err.message;
        }
        this.data = data;
    }
    async loadData(url) {
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (err) {
            throw err;
        }
    }

    render () {
        this.preload();
        this.renderHeader();
        this.renderBody();
        this.widgetCardWrapper.appendChild(this.widgetCard);
    }
    
    preload() {
        this.widgetCardWrapper = document.createElement('div');
        this.widgetCardWrapper.classList.add(...this.widgetCardClasses, 'widget-card-wrapper');
        this.widgetCard = document.createElement('div');
        this.widgetCard.classList.add('card', 'widget-card');
        this.createSpinner();
        this.spinner.hidden = false;
        widgetsWrapper.appendChild(this.widgetCardWrapper);
    }
}

class TimeWidget extends Widget {
    constructor(widgetData, vacationId) {
        super(widgetData, vacationId);
        this.url = (widgetData.additional) ? `http://api.openweathermap.org/data/2.5/weather?lat=${widgetData.additional.latlng[0]}&lon=${widgetData.additional.latlng[1]}&units=metric&lang=ru&appid=bedcbe351dba38c968e2b2e42d5d3040` : undefined;
        this.headerControls[2].action = this.removeFromDashboard;
    }

    async addToDashboard(li) {
        const result = await super.addToDashboard(li);
        if(result) {
            await this.init();
        }
    }
    async removeFromDashboard() {
        const result = await super.removeFromDashboard();
        if (result) {
            clearInterval(this.interval);
            await this.init();
        }
    }
    renderControl() {
        const {btn, span, li } = super.renderControl();
        btn.addEventListener('click',  async () => {
            await this.addToDashboard(li);
        });
        li.append(span, btn);
        widgetsSidebar.append(li);
    }

    async render() {
        await super.render();
        await super.setData(this.url);
        this.showWidgetContent();
        setTimeout(() => {
            this.spinner.hidden = true;
        });
    }
    
    calculateTime(timeOffset) {
        const date = new Date();
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds() + timeOffset, 0);
    }
    calculateSun(ms, timeOffset) {
        const date = new Date(ms * 1000);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getUTCSeconds() + timeOffset, 0).toUTCString().split(' ')[4];
    }
    timer(date, timeHTML) {
        this.interval = setInterval(() => {
            date.setSeconds(date.getSeconds() + 1);
            timeHTML.innerHTML = date.toLocaleTimeString();
        }, 1000);
    }

    showWidgetContent() {
        if (typeof this.data === 'string') {
            super.renderEmptyWidgetContent();
            return;
        }
        const timeHTML = document.createElement('p');
        timeHTML.classList.add('time', 'text-center');
        const time =  this.calculateTime(this.data.timezone);
        timeHTML.innerText = time.toLocaleTimeString();
        this.timer(time, timeHTML);
        this.body.append(timeHTML);
        const sunInfo = document.createElement('div');
        sunInfo.classList.add('time-sun-info');
        const sunInfoItems = [
            {name: 'sunrise', class: 'fas', caption: 'Восход'},
            {name: 'sunset', class: 'far', caption: 'Закат'}
        ];
        for (let i = 0; i < sunInfoItems.length; i++) {
            const sunInfoItem = document.createElement('p');
            const time = this.calculateSun(this.data.sys[sunInfoItems[i].name], this.data.timezone);
            sunInfoItem.innerHTML = `
                <i class="${sunInfoItems[i].class} fa-sun"></i>
                <strong>${sunInfoItems[i].caption}: </strong> ${time}
            `;
            sunInfo.appendChild(sunInfoItem);
        }
        this.body.append(sunInfo);
    }

    async init() {
        if (this.isActive) {
            await this.render();
            return;
        }
        this.renderControl();
    }
}

class WeatherWidget extends Widget {
    constructor(widgetData, vacationId) {
        super(widgetData, vacationId);
        this.url = (widgetData.additional) ? `http://api.openweathermap.org/data/2.5/forecast?lat=${widgetData.additional.latlng[0]}&lon=${widgetData.additional.latlng[1]}&units=metric&lang=ru&appid=bedcbe351dba38c968e2b2e42d5d3040` : undefined;
        this.headerControls[2].action = this.removeFromDashboard;
        this.widgetCardClasses = ['col-12', 'col-lg-8'];
    }

    async addToDashboard(li) {
        const result = await super.addToDashboard(li);
        if(result) {
            await this.init();
        }
    }
    async removeFromDashboard() {
        const result = await super.removeFromDashboard();
        if (result) {
            await this.init();
        }
    }
    renderControl() {
        const {btn, span, li } = super.renderControl();
        btn.addEventListener('click',  async () => {
            await this.addToDashboard(li);
        });
        li.append(span, btn);
        widgetsSidebar.append(li);
    }

    async render() {
        await super.render();
        await super.setData(this.url);
        this.showWidgetContent();
        setTimeout(() => {
            this.spinner.hidden = true;
        });
    }

    showWidgetContent() {
        if (typeof this.data === 'string') {
            super.renderEmptyWidgetContent();
            return;
        }
        const weatherCardRow = document.createElement('div');
        weatherCardRow.classList.add('row');
        this.body.append(weatherCardRow);
        for (let i = 0; i < 4; i++) {
            const list = this.data.list[i];
            const weatherItem = document.createElement('div');
            weatherItem.classList.add('weather-item', 'col-12', 'col-sm-6');
            weatherItem.innerHTML = `
                <div class="weather-item-header">
                    <p class="weather-date"><strong>${new Date(list.dt_txt).toLocaleDateString()}</strong></p>
                    <p class="weather-item-time"><strong>${list.dt_txt.substring(11, 16)}</strong></p>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p class="weather-item-temp">${Math.round(list.main.temp)}°C</p>
                        <p><strong>Ощущается как: </strong> ${Math.round(list.main.feels_like)}°C</p>
                        <p><strong>Влажность: </strong> ${list.main.humidity} %</p>
                        <p><strong>Давление: </strong> ${list.main.pressure} мм рт. ст.</p>
                    </div>
                    <div class="col-6">
                        <p><img src="http://openweathermap.org/img/w/${list.weather[0].icon}.png" alt=""></p>
                        <p>${list.weather[0].description}</p>
                        <p><strong>Скорость ветра: </strong> ${list.wind.speed} м/с</p>
                    </div>
                </div>`;
            weatherCardRow.append(weatherItem);
        }
    }

    async init() {
        if (this.isActive) {
                await this.render();
                return;
            }
        this.renderControl();
    }
}

class InfoWidget extends Widget {
    constructor(widgetData, vacationId) {
        super(widgetData, vacationId);
        this.info = widgetData.info;
        this.headerControls[2].action = this.removeFromDashboard;
        this.widgetCardClasses = ['col-12', 'col-lg-7', 'country-info'];
    }
    
    async addToDashboard(li) {
        const result = await super.addToDashboard(li);
        if(result) {
            await this.init();
        }
    }
    async removeFromDashboard() {
        const result = await super.removeFromDashboard();
        if (result) {
            await this.init();
        }
    }
    renderControl() {
        const {btn, span, li } = super.renderControl();
        btn.addEventListener('click',  async () => {
            await this.addToDashboard(li);
        });
        li.append(span, btn);
        widgetsSidebar.append(li);
    }
    
    async render() {
        await super.render();
        await this.showWidgetContent();
        setTimeout(() => {
            this.spinner.hidden = true;
        });
    }
    
    getAdditionalInfo(options, params) {
        if (this.info.additional) {
            let additionalInfo = '';
            this.info.additional[options].forEach(option => {
                let values =  params.map(param => (typeof option === 'object') ? option[param] : option);
                values = (values.length > 1) ? values.join(', ') : values[0];
                additionalInfo += `<span>${values}</span>`;
            });
            return additionalInfo;
        }
        return `<i class="far fa-sad-tear"></i> Не удалось загрузить`;
    }
    
    getMap() {
        let map;
        if (this.info.additional) {
            map = new Map(this.info.additional.latlng, this.info.isoAlpha3);
            return map;
        }
        return '<i class="far fa-2x fa-sad-tear"></i> <span>Не удалось загрузить карту</span>';
    }
    
    async showWidgetContent() {
        let languages = this.getAdditionalInfo('languages', ['name']);
        let currencies = this.getAdditionalInfo('currencies', ['name', 'symbol']);
        let callingCodes = this.getAdditionalInfo('callingCodes', ['name']);
        const map = this.getMap();
        
        const countryInfoRow = document.createElement('div');
        countryInfoRow.classList.add('row');
        const countryInfoColLeft = document.createElement('div');
        countryInfoColLeft.classList.add('col-12', 'col-lg-5');
        countryInfoColLeft.innerHTML = `
            <p><strong>Столица: </strong><span>${this.info.capital}</span></p>
            <p><strong>Население: </strong><span>${this.info.population} чел.</span></p>
            <p><strong>Площадь: </strong><span>${this.info.areaInSqKm} км <sup>2</sup></span></p>
            <p><strong>Телефонный код: </strong><span>${callingCodes}</span></p>
            <p><strong>Языки: </strong><span>${languages}</span></p>
            <p><strong>Валюта: </strong><span>${currencies}</span></p>
        `;
        countryInfoRow.appendChild(countryInfoColLeft);
        
        const countryInfoColRight = document.createElement('div');
        countryInfoColRight.classList.add('col-12', 'col-lg-7');
        
        const mapWrapper = document.createElement('div');
        mapWrapper.id = 'map';
        countryInfoColRight.appendChild(mapWrapper);
        countryInfoRow.appendChild(countryInfoColRight);
        this.body.appendChild(countryInfoRow);
        if (typeof map !== 'string') {
            setTimeout(async () => {
                await map.load(mapWrapper);
            });
        } else {
            mapWrapper.classList.add('empty-map');
            mapWrapper.innerHTML = map;
        }
    }
    
    async init() {
        if (this.isActive) {
            await this.render();
            return;
        }
        this.renderControl();
    }
}

class BudgetWidget extends Widget {
    constructor(widgetData, vacationId) {
        super(widgetData, vacationId);
        this.url = `/api/widgets/budgetInfo?vacationId=${vacationId}`;
        this.headerControls[2].action = this.removeFromDashboard;
        this.widgetCardClasses = ['col-12', 'col-lg-4', 'budget'];
    }
    
    async addToDashboard(li) {
        const result = await super.addToDashboard(li);
        if(result) {
            await this.init();
        }
    }
    async removeFromDashboard() {
        const result = await super.removeFromDashboard();
        if (result) {
            await this.init();
        }
    }
    renderControl() {
        const {btn, span, li } = super.renderControl();
        btn.addEventListener('click',  async () => {
            await this.addToDashboard(li);
        });
        li.append(span, btn);
        widgetsSidebar.append(li);
    }
    
    adaptData() {
        this.data = this.data.info;
    }
    
    async render() {
        await super.render();
        await super.setData(this.url);
        console.log(this.data);
        this.adaptData();
        await this.showWidgetContent();
        setTimeout(() => {
            this.spinner.hidden = true;
        });
    }
    
    async showWidgetContent() {
        console.log(this.data);
        const budgetCategoriesWrapper = document.createElement('div');
        budgetCategoriesWrapper.classList.add('budget-categories-wrapper');
        for (let i = 0; i < this.data.length; i++) {
            let categoryTbodyRows = [];
            if (this.data[i].items) {
                for (let j = 0; j < this.data[i].items.length; j++) {
                    const categoryTbodyRow = `<tr>
                    <td>${this.data[i].items[j].name}</td>
                    <td class="budget-table-price-cell">${this.data[i].items[j].price}</td>
                </tr>`
                    categoryTbodyRows.push(categoryTbodyRow);
                }
            }
            
            const budgetCategory = document.createElement('div');
            budgetCategory.classList.add('budget-category');
            
            budgetCategory.innerHTML = `
            <table class="budget-table table table-bordered table-striped table-hover table-sm">
                <thead class="thead-dark">
                <tr>
                    <th class="budget-table-header-cell">
                        <span>${this.data[i].category}</span>
                    </th>
                    <th class="budget-table-price-cell">${this.data[i].sum}</th>
                </tr>
                </thead>
                <tbody class="budget-table-body">${categoryTbodyRows.join('')}</tbody>
            </table>
            <form novalidate id="form-${this.data[i].id}" class="budget-category-form form-group">
                <input type="text" id="budget-name-${i}" class="form-control form-control-sm budget-category-form-name" name="budget-category-name" placeholder="Название" required>
                <input type="text" id="budget-price-${i}" class="form-control form-control-sm budget-category-form-price" name="budget-category-price" placeholder="Сумма" required data-pattern="^\\d+$">
                <button class="btn btn-sm btn-success budget-category-form-submit" type="submit"><i class="fas fa-plus"></i></button>
                <div class="invalid-feedback"></div>
            </form>`;
            const budgetHeader = budgetCategory.querySelector('.budget-table-header-cell');
            const budgetSumHtml = budgetCategory.querySelector('.budget-table-price-cell');
            const budgetTableBody = budgetCategory.querySelector('.budget-table-body');
            const form = budgetCategory.querySelector('form');
            setValidateListeners(form);
            const submitBtn = budgetCategory.querySelector('.budget-category-form-submit');
            submitBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                const error = validate(form);
                if (error) return;
                const name = form.querySelector('#budget-name-'+ i).value;
                const price = form.querySelector('#budget-price-'+ i).value;
                const formData = { name, price, categoryId: this.data[i].id };
                const result = await this.sendRequest('/api/widgets/saveBudgetInfo', 'POST', formData);
                if (result) {
                    const categoryTbodyRow = `<tr>
                        <td>${name}</td>
                        <td class="budget-table-price-cell">${price}</td>
                    </tr>`
                    const updatedSum = Number(budgetSumHtml.innerText) + Number(price);
                    budgetSumHtml.innerHTML = updatedSum;
                    budgetTableBody.innerHTML += categoryTbodyRow;
                    setServerFeedback({ok: true, caption: 'Запись успешно добавлена'});
                }
            });
    
            budgetHeader.addEventListener('click', function() {
                this.classList.toggle('open');
                budgetTableBody.classList.toggle('open');
                form.classList.toggle('open');
            });
    
            budgetCategoriesWrapper.appendChild(budgetCategory);
        }
        
        this.body.appendChild(budgetCategoriesWrapper);
    }
    
    async init() {
        if (this.isActive) {
            await this.render();
            return;
        }
        this.renderControl();
    }
    
}
