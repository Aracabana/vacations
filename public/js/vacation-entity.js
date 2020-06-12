class Vacation {
    constructor(vacation) {
        this.id = vacation.id;
        this.countryName = vacation.countryName;
        this.countryCode = vacation.countryCode;
        this.dateFrom = new Date(vacation.dateFrom).toLocaleDateString();
        this.dateTo = new Date(vacation.dateTo).toLocaleDateString();
        this.status = Vacation.calculateStatus(vacation.dateFrom, vacation.dateTo);
    }
    
    static calculateStatus(dateFrom, dateTo) {
        dateFrom = new Date(dateFrom);
        dateTo = new Date(dateTo);
        const fromMs = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate(), 0, 0, 0, 0).valueOf();
        const toMs = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate(), 0, 0, 0, 0).valueOf();
        const now = new Date();
        const nowMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).valueOf();
        console.log('nowMs' + nowMs);
        console.log('fromMs' + fromMs);
        console.log('toMs' + toMs);
        return (nowMs < fromMs) ? 'Ожидание' : (nowMs >= fromMs && nowMs < toMs) ? 'В процессе' : 'Завершен';
    }
    
    getStatusClass() {
        return (this.status === 'Ожидание') ? 'success' : (this.status === 'В процессе') ? 'warning' : 'danger';
    }
    getFieldsArray() {
        return [this.countryName, this.dateFrom, this.dateTo, this.status];
    }
    
    async setFlag() {
        try {
            const response = await fetch(`https://restcountries.eu/rest/v2/alpha/${this.countryCode}?fields=flag`);
            if (response.status === 404) {
                throw new Error('Флаг для данной страны не найден');
            }
            const data = await response.json();
            this.flag = data.flag;
        } catch (err) {
        }
    }
    async setCountryData() {
        let country;
        try {
            country = new Country(this.countryCode);
            await country.loadData(['latlng', 'languages', 'flag', 'callingCodes', 'borders', 'currencies']);
        } catch (err) {
            console.log('Доп. данные не загружены');
        }
        finally {
            this.countryInfo = country.data;
        }
    }
    
    async edit(dates) {
        try {
            const requestData = {
                id: this.id,
                dateFrom: dates.dateFrom,
                dateTo: dates.dateTo
            }
            const response = await fetch('/vacation', {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(requestData)
            });
            if (response.redirected) {
                window.location.href = response.url;
            }
            const data = await response.json();
            if (!data.ok) {
                throw new Error(data.caption);
            }
            const vacation = data.vacation;
            this.dateFrom = new Date(vacation.dateFrom).toLocaleDateString();
            this.dateTo = new Date(vacation.dateTo).toLocaleDateString();
            this.status = Vacation.calculateStatus(vacation.dateFrom, vacation.dateTo);
            return {ok: data.ok, caption: data.caption};
        } catch (err) {
            return {ok: false, caption: err.message};
        }
    }
    async remove() {
        try {
            const response = await fetch('/vacation', {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: this.id})
            });
            if (response.redirected) {
                window.location.href = response.url;
            }
            const data = await response.json();
            return data;
        } catch (err) {
            return {ok: false, caption: 'Вутрення ошибка сервера'};
        }
    }
}
