function setValidateListeners(form) {
    const formControls = Array.from(form.querySelectorAll('.form-control'));
    const btn = form.querySelector('button');
    formControls.forEach(input => {
        const feedback = input.closest('.form-group').querySelector('.invalid-feedback');
        input.addEventListener('blur', function () {
            const error = validateInput(input, form);
            if (error) setFeedback(input, feedback, error);
        });
        input.addEventListener('input', removeFeedback.bind(this, input, feedback));
    })
}

function checkInputIsEmpty(input) {
    if (!input.value) {
        return 'Поле обязательное для заполнения';
    }
}
function checkLength(input, mixValue) {
    if (input.value.length < mixValue) {
        return `Поле должно содержать больше ${mixValue-1}-х символов`;
    }
}
function matchPasswords(password, confirmPassword) {
    if (password.value !== confirmPassword.value) {
        return 'Пароли не совпадают';
    }
}
function checkPattern(input, pattern) {
    const regExp = new RegExp(pattern, 'gi');
    if (!regExp.test(input.value)) {
        return 'Неверный формат данных';
    }
}

function validateInput(input) {
    const inputData = input.dataset;
    let error;
    if(input.hasAttribute('required')) {
        error = checkInputIsEmpty(input);
        if (error) return error;
    }
    if(inputData.min) {
        error = checkLength(input, inputData.min);
        if (error) return error;
    }
    if (inputData.pattern) {
        error = checkPattern(input, inputData.pattern);
        if (error) return error;
    }
    if(inputData.comparewith) {
        let password = document.getElementById(inputData.comparewith);
        error = matchPasswords(password, input);
        if (error) return error;
    }
    return false;
}
function validate(form) {
    const formControls = Array.from(form.querySelectorAll('.form-control'));
    let hasError = false;
    for (let i = 0; i < formControls.length; i++) {
        const feedback = formControls[i].closest('.form-group').querySelector('.invalid-feedback');
        removeFeedback(formControls[i], feedback);
        const error = validateInput(formControls[i], form);
        if (error) {
            setFeedback(formControls[i], feedback, error);
            hasError = true;
        }
    }
    if(hasError) return true;
}

function setFeedback(input, feedback, feedbackText) {
    input.classList.add('is-invalid');
    feedback.style.display = 'block';
    feedback.innerText = feedbackText;
}
function removeFeedback(input, feedback) {
    input.classList.remove('is-invalid');
    feedback.style.display = 'none';
}
