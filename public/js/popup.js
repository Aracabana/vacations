function editPopup(html, vacation, updateCallback) {
    console.log(vacation);
    const popup = document.getElementById(html);
    const popupTitle = popup.querySelector('#js-popup-title');
    const form = popup.querySelector('#form-edit');
    const dateFrom = popup.querySelector('#dateFrom');
    const dateTo = popup.querySelector('#dateTo');
    const submit = popup.querySelector('#popup-submit');
    popupTitle.innerText = vacation.countryName;
    dateFrom.value = vacation.dateFrom.split('.').reverse().join('-');
    dateTo.value = vacation.dateTo.split('.').reverse().join('-');
    submit.addEventListener('click', async function (e) {
        e.preventDefault();
        const error = validate(this);
        if (error) return;
        const result =  await vacation.edit({
            dateFrom: dateFrom.value,
            dateTo: dateTo.value
        });
        setServerFeedback(result);
        if (result.ok) {
            updateCallback();
        }
        closePopup(popup);
    });
    setDatePickersOptions();
    setValidateListeners(form);
    openPopup(popup);
}

function openPopup(popup) {
    popup.classList.add('open');
    popup.style.display = 'block';
}
function closePopup(popup) {
    if (popup.classList.contains('open')) {
        popup.style.display = 'none';
        popup.classList.remove('open');
    }
}

const popupCloseBtn = document.querySelector('.js-popup-close');
popupCloseBtn.addEventListener('click', function () {
    closePopup(this.closest('.js-popup-wrapper'));
});
document.addEventListener('mouseup', function(e) {
    const target = e.target.closest('.js-popup');
    const popup = document.querySelector('.js-popup');
    const popupWrapper = document.querySelector('.js-popup-wrapper');
    if (target !== popup) {
        closePopup(popupWrapper);
    }
});
document.addEventListener('keyup', function(e) {
    const popupWrapper = document.querySelector('.js-popup-wrapper');
    if (e.code === 'Escape') {
        closePopup(popupWrapper);
    }
});

