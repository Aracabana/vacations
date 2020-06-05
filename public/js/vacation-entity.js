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
        const fromMs = new Date(dateFrom).valueOf();
        const toMs = new Date(dateTo).valueOf();
        const now = new Date();
        const nowMs = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
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
            console.log(err);
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
            const data = await response.json();
            return data;
        } catch (err) {
            return {ok: false, caption: 'Вутрення ошибка сервера'};
        }
    }
    
    edit() {
        console.log(this);
        // window.location.href = '/vacation/' + this.id;
    }
}
