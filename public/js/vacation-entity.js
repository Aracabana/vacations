class Vacation {
    constructor(vacation) {
        this.id = vacation.id;
        this.countryName = vacation.countryName;
        this.dateFrom = vacation.dateFrom;
        this.dateTo = vacation.dateTo;
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
    
    async remove() {
        spinner.hidden = false;
        try {
            const response = await fetch('/vacation', {
                method: 'DELETE',
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: this.id})
            });
            const data = await response.json();
            setServerFeedback(data);
            return data.ok;
        } catch (err) {
            setServerFeedback({ok: false, caption: err});
        } finally {
            spinner.hidden = true;
        }
    }
    
    edit() {
        window.location.href = '/vacation/' + this.id;
    }
}
