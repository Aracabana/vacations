function setListeners(form) {
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
    console.log(input.value);
    if (!input.value) {
        return 'Поле обязательное для заполнения';
    }
}
function checkLength(input, maxValue) {
    if (input.value.length < maxValue) {
        return 'Поле должно содержать больше 3-х символов';
    }
}
function matchPasswords(password, confirmPassword) {
    if (password.value !== confirmPassword.value) {
        return 'Пароли не совпадают';
    }
}
function checkEmail(input) {
    const emailRegExp = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/gi;
    if (!emailRegExp.test(input.value)) {
        return 'Неверный E-mail';
    }
}

function validateInput(input, form) {
    let error = checkInputIsEmpty(input);
    if (error) return error;
    if (input === form.login || input === form.password) {
        error = checkLength(input, 4);
        if (error) return error;
    }
    if (input === form.confirmPassword) {
        let password = form.password;
        error = matchPasswords(password, input);
        if (error) return error;
    }
    if (input === form.email) {
        error = checkEmail(input);
        if (error) return error;
    }
    return false;
}
function validate(form) {
    const formControls = Array.from(form.querySelectorAll('.form-control'));
    const errors = [];
    for (let i = 0; i < formControls.length; i++) {
        const feedback = formControls[i].closest('.form-group').querySelector('.invalid-feedback');
        const error = validateInput(formControls[i], form);
        if (error) {
            errors.push({
                input: formControls[i],
                feedback,
                error
            });
        }
    }
    if (errors.length) {
        for (let i = 0; i < errors.length; i++) {
            setFeedback(errors[i].input, errors[i].feedback, errors[i].error);
        }
        return true;
    }
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
function setServerFeedback(data) {
    const serverFeedback = document.querySelector('#serverFeedback');
    serverFeedback.classList.remove('alert-success', 'alert-danger');
    serverFeedback.classList.add(data.ok ? 'alert-success' : 'alert-danger');
    serverFeedback.hidden = false;
    serverFeedback.innerText = data.caption;
    return serverFeedback;
}
