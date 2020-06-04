const spinner = document.querySelector('#spinner');

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
    const error = validate(this);
    if (error) return;
    const login = document.getElementById('authLogin').value;
    const password = document.getElementById('authPassword').value;
    const setSession = document.getElementById('authRememberMe').checked;
    const formData = {login, password, setSession};
    spinner.hidden = false;
    await sendResponse('/auth/login', '/', formData);
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
    const error = validate(this);
    if (error) return;
    const login = document.getElementById('regLogin').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const formData = {login, email, password, confirmPassword};
    spinner.hidden = false;
    await sendResponse('/auth/registration', '/auth/login', formData);
}

async function sendResponse(url, redirectUrl, formData) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        setServerFeedback(data);
        if (data.ok) {
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 500);
        }
    } catch (err) {
        setServerFeedback({ ok: false, caption: err });
    } finally {
        setTimeout(() => {
            spinner.hidden = true;
        }, 500)
    }
}



