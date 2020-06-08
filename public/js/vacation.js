const title = document.querySelector('#vacation-country');
const dates = document.querySelector('#vacation-dates');
const editVacationBtn = document.querySelector('#edit-vacation-btn');
const removeVacationBtn = document.querySelector('#remove-vacation-btn');
const widgetsWrapper = document.querySelector('#widgets-wrapper');

const timeWidgetAddBtn = document.querySelector('#time-widget-add-btn');
// const weatherWidgetAddBtn = document.querySelector('#weather-widget-add-btn');
timeWidgetAddBtn.addEventListener('click', function () {
    
    const timeWidget = new TimeWidget();
    timeWidget.render();
});

window.onload = async function() {
    const data = await loadVacation();
    const vacation = new VacationPage(data);
    await vacation.init();
}

async function loadVacation() {
    try {
        const vacationId = window.location.pathname.split('/')[2];
        const url = `/api/getVacation?id=${vacationId}`;
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
    }

    renderInfo() {
        if (this.flag) {
            const flagImg = document.createElement('img');
            flagImg.classList.add('flag');
            flagImg.src = this.flag;
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
                console.log(data);
            }
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
        await this.setFlag();
        this.renderInfo();
        await this.loadWidgets();
        this.setListeners();
    }
}

class Widget {
    constructor() {
        this.widget = document.createElement('div');
        this.name = '';
    };
    async static checkExist() {
        try {
            const url = `/api/getWidgets?vacationId=${this.id}`;
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'}
            });
        }
        catch {
        
        }
    }
    
    render() {
        this.widget.classList.add('card');
        const header = document.createElement('div');
        header.classList.add('card-header');
        header.innerText = this.name;
        this.widget.appendChild(header);
        const body = document.createElement('div');
        body.classList.add('card-body');
        this.widget.appendChild(body);
        widgetsWrapper.appendChild(this.widget);
    }
    
    save() {
    
    }
}

class TimeWidget extends Widget {
    constructor() {
        super();
        this.name = 'Текущее время'
    }
}
