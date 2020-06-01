// const geonames = new Geonames({
//     username: 'antondrik',
//     lang: 'ru',
//     encoding: 'JSON'
// });

window.onload = function() {
    const loginForm = document.querySelector('#login-form');
    const registrationForm = document.querySelector('#registration-form');
    if (loginForm) {
        loginForm.addEventListener('submit', submitLogin);
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
    const login = document.getElementById('regLogin').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const formData = {login, email, password, confirmPassword};
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

function setListeners(form) {
    let formControls = Array.from(form.querySelectorAll('.form-control'));
    let btn = form.querySelector('button');
    formControls.forEach(input => {
        let feedback = input.closest('.form-group').querySelector('.invalid-feedback');
        input.addEventListener('blur', function () {
            toggleBtnState(formControls, btn);
            if (checkIsEmpty(input, feedback)) {
                if (input === form.login || input === form.password) {
                    checkLength(input, feedback, 4);
                }
                if (input === form.confirmPassword) {
                    let passwordField = form.password;
                    matchPasswords(input, feedback, passwordField)
                }
                if (input === form.email) {
                    checkEmail(input, feedback);
                }
            }
        });
        input.addEventListener('keyup', removeFeedback.bind(this, input, feedback));
    })
}
function checkIsEmpty(input, feedback) {
    if (!input.value) {
        setFeedback(input, feedback, 'Поле обязательно для заполнения');
        return false;
    }
    return true;
}
function checkLength(input, feedback, maxValue) {
        if (input.value.length < maxValue) {
            setFeedback(input, feedback, 'Поле должно содержать больше 3-х символов');
        }
}
function matchPasswords(input, feedback, passwordField) {
    if (input.value !== passwordField.value) {
        setFeedback(input, feedback, 'Пароли не совпадают');
    }
}
function checkEmail(input, feedback) {
    const emailRegExp = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/gi;
    if (!emailRegExp.test(input.value)) {
        setFeedback(input, feedback, 'Неверный E-mail');
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
function toggleBtnState(formControls, btn) {
    const isEmpty = formControls.some(input => !input.value);
    if (!isEmpty) {
        const isInvalid = formControls.some(input => input.classList.contains('is-invalid'));
        btn.disabled = isInvalid;
        return;
    }
    btn.disabled = true;
}
function setServerFeedback(data) {
    const serverFeedback = document.querySelector('#serverFeedback');
    serverFeedback.classList.remove('alert-success', 'alert-danger');
    serverFeedback.classList.add(data.ok ? 'alert-success' : 'alert-danger');
    serverFeedback.hidden = false;
    serverFeedback.innerText = data.caption;
    return serverFeedback;
}
