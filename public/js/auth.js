import { setValidateListeners, validate } from './helpers/validator';
import setServerFeedback from './helpers/server-feedback';

const spinner = document.querySelector('#spinner');
const feedbackElem = document.querySelector('#serverFeedback');

window.onload = function() {
    const loginForm = document.querySelector('#login-form');
    const registrationForm = document.querySelector('#registration-form');
    if (loginForm) {
        loginForm.addEventListener('submit', submitLogin);
        setValidateListeners(loginForm);
    }
    if (registrationForm) {
        registrationForm.addEventListener('submit', submitRegistration);
        setValidateListeners(registrationForm);
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
    await sendResponse('/auth/login', '/', formData);
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
    await sendResponse('/auth/registration', '/auth/login', formData);
}

async function sendResponse(url, redirectUrl, formData) {
    try {
        spinner.hidden = false;
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        setServerFeedback(feedbackElem, data);
        if (data.ok) {
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 500);
        }
    } catch (err) {
        setServerFeedback(feedbackElem,{ ok: false, caption: err });
    } finally {
        setTimeout(() => {
            spinner.hidden = true;
        }, 500)
    }
}



