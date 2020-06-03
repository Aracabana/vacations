window.onload = function() {
    const loginForm = document.querySelector('#login-form');
    const registrationForm = document.querySelector('#registration-form');
    if (loginForm) {
        loginForm.addEventListener('submit', submitLogin);
        setListeners(loginForm);
    }
    if (registrationForm) {
        registrationForm.addEventListener('submit', submitRegistration);
        setListeners(registrationForm);
    }
}

async function submitLogin(e){
    e.preventDefault();
    const login = document.getElementById('authLogin').value;
    const password = document.getElementById('authPassword').value;
    const setSession = document.getElementById('authRememberMe').checked;
    const formData = {login, password, setSession};
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        console.log(data);
        const serverFeedback = setServerFeedback(data);
        setTimeout(() => {
            if (data.ok) {
                localStorage.setItem('login', data.login);
                window.location.href = '/';
                return;
            }
            serverFeedback.hidden = true;
        }, 500);
    }
    catch (err) {
        console.log(err);
    }


    // const x = await fetch("http://api.geonames.org/searchJSON?countryCode=RU&lang=ru&username=antondrik");
    // const z = await x.json();
    // console.log(z);
    // const img = document.getElementById('x');
    // img.src = z[0].flag;

    // try{
    //     const countries = await geonames.countryInfo({country: 'BY'});
    //     const cities = await geonames.children({geonameId: countries.geonames[0].geonameId});
    //     console.log(cities);
    //     const {east, north, south, west} = cities.geonames[0].bbox;
    //     const city = await geonames.cities({
    //         east, north, south, west
    //     });
    //     console.log(city.geonames);
    // }catch(err){
    //     console.error(err);
    // }
    
}
async function submitRegistration(e) {
    e.preventDefault();
    const formControls = Array.from(this.querySelectorAll('.form-control'));
    const errors = [];
    for (let i = 0; i < formControls.length; i++) {
        const feedback = formControls[i].closest('.form-group').querySelector('.invalid-feedback');
        const error = validateInput(formControls[i], this);
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
        return;
    }
    const login = document.getElementById('regLogin').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const formData = {login, email, password, confirmPassword};
    try {
        const response = await fetch('/auth/registration', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        console.log(data);
        const serverFeedback = setServerFeedback(data);
        setTimeout(() => {
            if (data.ok) {
                window.location.href = '/auth/login';
                return;
            }
            serverFeedback.hidden = true;
        }, 2000);
    }
    catch (err) {
        console.log(err);
    }
}

function setListeners(form) {
    const formControls = Array.from(form.querySelectorAll('.form-control'));
    const btn = form.querySelector('button');
    formControls.forEach(input => {
        const feedback = input.closest('.form-group').querySelector('.invalid-feedback');
        input.addEventListener('blur', function () {
            const error = validateInput(input, form);
            if (error) setFeedback(input, feedback, error);
        });
        input.addEventListener('keyup', removeFeedback.bind(this, input, feedback));
    })
}
function checkInputIsEmpty(input) {
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
function toggleBtnState(formControls, btn) {
    const isEmpty = formControls.some(input => !input.value);
    if (!isEmpty) {
        const isInvalid = formControls.some(input => input.classList.contains('is-invalid'));
        btn.disabled = isInvalid;
        return;
    }
    btn.disabled = true;
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
