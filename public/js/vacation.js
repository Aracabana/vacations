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
        console.log(this)
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
                    item.additional = this.countryInfo.additional;
                    let widget;
                    if(item.id === 1) {
                        widget = new TimeWidget(item, this.id);
                        widget.init();
                    }
                    if(item.id === 2) {
                        widget = new WeatherWidget(item, this.id);
                        // widget.init();
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
        this.widgetCard = '';
        this.body = '';
        this.headerControls = [
            {
                classes: [ 'fa-expand-alt', 'text-secondary'],
                action: this.expand
            },
            {
                classes: [ 'fa-cog', 'text-secondary'],
                action: this.showOptions
            },
            {
                classes: ['fa-trash-alt', 'text-danger'],
                action: this.remove
            }
        ]
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
            try {
                const responseData = {
                    widgetId: this.id,
                    vacationId: this.vacationId
                }
                const response = await fetch(url, {
                    method: method,
                    credentials: 'same-origin',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(responseData)
                });
                const data = await response.json();
                if (!data.ok) {
                    throw new Error(data.caption);
                }
                return true;
            } catch (err) {
                console.log(err);
                setServerFeedback({ok: false, caption: err.message});
            } finally {
                this.requestLoader = false;
            }
        }
        return false;
    }
    
    async remove() {
        const result = await this.sendRequest('/api/removeWidget', 'DELETE');
        if (result) {
            this.widgetCard.remove();
            this.widgetCard = '';
            this.isActive = false;
            await this.init();
        }
    }
    
    async save() {
        const result = await this.sendRequest('/api/saveWidget', 'POST');
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
        return {btn, li, span};
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
        parent.appendChild(this.body);
    }
    
    render () {
        this.widgetCard = document.createElement('div');
        this.widgetCard.classList.add('col-12', 'col-md-6', 'col-lg-4', 'widget-card-wrapper');
        const widget = document.createElement('div');
        widget.classList.add('card', 'widget-card');
        this.renderHeader(widget);
        this.renderBody(widget);
        this.widgetCard.appendChild(widget);
        widgetsWrapper.appendChild(this.widgetCard);
        // const x = new Promise((res, rej) => {
        //     setTimeout(() => {
        //         res(this.constructor.name);
        //     }, this.time)
        // });
        // x.then(result => {
        //     console.log(result);
        // });
    }

    // async init() {
    //     if (this.isActive) {
    //         this.render();
    //         return;
    //     }
    //     this.renderControl();
    // }
}

class TimeWidget extends Widget {
    constructor(widgetData, vacationId) {
        super(widgetData, vacationId);
        this.latlng = (widgetData.additional) ? widgetData.additional.latlng : undefined;
    }
    async loadData() {
        if(this.latlng) {
            const url = `http://api.geonames.org/timezoneJSON?lat=${this.latlng[0]}&lng=${this.latlng[1]}&username=antondrik`;
            const response = await fetch(url);
            const data = await response.json();
            this.data = data;
            return;
        }
        this.data = 'Данных для данного виджета нет';
    }
    
    renderControl() {
        const {btn, li, span} = super.renderControl();
        btn.addEventListener('click',  async () => {
            const result = await this.save();
            if (result) {
                li.remove();
                this.isActive = true;
                await this.init();
            }
        });
        li.append(span, btn);
        widgetsSidebar.append(li);
    }
    
    async init() {
        if (this.isActive) {
            await this.loadData();
            this.render();
            return;
        }
        this.renderControl();
        console.log(this);
    }
}

class WeatherWidget extends Widget {
    constructor(widgetData, vacationId) {
        super(widgetData, vacationId);
    }

}
