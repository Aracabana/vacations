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
            const url = `/api/getWidgets?vacationId=${this.id}`;
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'}
            });
            const data = await response.json();
            if (data.ok) {
                data.widgets.forEach(item => {
                    let widget;
                    if (item.id === 1) {
                        item.additional = this.countryInfo.additional;
                        widget = new TimeWidget(item, this.id);
                        widget.init();
                    }
                    if (item.id === 2) {
                        item.bbox = {
                            west: this.countryInfo.west,
                            north: this.countryInfo.north,
                            south: this.countryInfo.south,
                            east: this.countryInfo.east
                        }
                        widget = new WeatherWidget(item, this.id);
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

    async init() {
        this.renderInfo();
        await this.loadWidgets();
        this.setListeners();
    }
}

class Widget {
    constructor(widgetData, vacationId) {
        this.id = widgetData.id;
        this.name = widgetData.name;
        this.vacationId = vacationId;
        this.isActive = widgetData.isActive;
        this.spinner = '';
        this.widgetCard = '';
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
    
    async sendRequest(url, method) {
        if (!this.requestLoader) {
            this.requestLoader = true;
            if(this.spinner) {
                this.spinner.hidden = false;
            }
            try {
                const responseData = { widgetId: this.id, vacationId: this.vacationId };
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
                if(this.spinner) {
                    this.spinner.hidden = true;
                }
            }
        }
        return false;
    }
    
    async removeFromDashboard() {
        const result = await this.sendRequest('/api/removeWidget', 'DELETE');
        if (result) {
            this.widgetCard.remove();
            this.widgetCard = '';
            this.body = '';
            this.isActive = false;
        }
        return result;
    }
    async addToDashboard(li) {
        const result = await this.sendRequest('/api/saveWidget', 'POST');
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
    renderHeader(parent) {
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
        parent.appendChild(header);
    }
    renderBody(parent) {
        this.body = document.createElement('div');
        this.body.classList.add('card-body');
        this.createSpinner();
        parent.appendChild(this.body);
    }
    renderEmptyWidgetContent() {
        const err = document.createElement('span');
        err.innerText = this.data;
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
        this.widgetCard.append(this.spinner);
    }

    async setData(url = undefined) {
        if (!url) {
            this.data = 'Данных для виджета нет';
            return;
        }
        let data;
        try {
            this.spinner.hidden = false;
            data = await this.loadData(url);
            if (typeof data === 'string') {
                throw new Error(data);
            }
        } catch (err) {
            data = err.message;
        } finally {
            this.spinner.hidden = true;
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
        this.widgetCard = document.createElement('div');
        this.widgetCard.classList.add('col-12', 'col-md-6', 'col-lg-4', 'widget-card-wrapper');
        const widget = document.createElement('div');
        widget.classList.add('card', 'widget-card');
        this.renderHeader(widget);
        this.renderBody(widget);
        this.widgetCard.appendChild(widget);
        // const x = new Promise((res, rej) => {
        //     setTimeout(() => {
        //         res(this.constructor.name);
        //     }, this.time)
        // });
        // x.then(result => {
        //     console.log(result);
        // });
    }
}

class TimeWidget extends Widget {
    constructor(widgetData, vacationId) {
        super(widgetData, vacationId);
        this.latlng = (widgetData.additional) ? widgetData.additional.latlng : undefined;
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
        let url;
        if (this.latlng) {
            url = `http://api.geonames.org/timezoneJSON?lat=${this.latlng[0]}&lng=${this.latlng[1]}&username=antondrik`;
        }
        await super.render();
        await super.setData(url);
        this.showWidgetContent();
        widgetsWrapper.appendChild(this.widgetCard);
    }

    showWidgetContent() {
        if (typeof this.data === 'string') {
            super.renderEmptyWidgetContent();
            return;
        }
        const time = document.createElement('span');
        const date = new Date(this.data.time);
        time.innerText = date.toLocaleTimeString();
        this.body.append(time);
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
        this.bbox = widgetData.bbox;
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
        let url;
        url = `http://api.geonames.org/weatherJSON?north=${this.bbox.north}&south=${this.bbox.south}&east=${this.bbox.east}&west=${this.bbox.west}&lang=ru&username=antondrik`;
        await super.render();
        await super.setData(url);
        this.showWidgetContent();
        widgetsWrapper.appendChild(this.widgetCard);
    }

    showWidgetContent() {
        if (typeof this.data === 'string') {
            super.renderEmptyWidgetContent();
            return;
        }
        console.log(this.data);
        // const time = document.createElement('span');
        // const date = new Date(this.data.time);
        // time.innerText = date.toLocaleTimeString();
        // this.body.append(time);
    }

    async init() {
        if (this.isActive) {
            await this.render();
            return;
        }
        this.renderControl();
    }
}
