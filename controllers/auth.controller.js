const { User } = require('../models');
const bcrypt = require('bcrypt');

async function validateReg(login, email, password, confirmPassword) {
    const emailRegExp = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/gi;
    if (!login || !email || !password || !confirmPassword) {
        throw new Error('Не все поля заполнены');
    }
    if (login.length < 4 || password.length < 4) {
        throw new Error('Поле должно содержать больше 3-х символов');
    }
    if (!emailRegExp.test(email)) {
        throw new Error('Неверный E-mail');
    }
    if (password !== confirmPassword) {
        throw new Error('Пароли не совпадают');
    }
    try {
        const user = await User.getUser(login);
        if (user) {
            throw new Error('Пользователь с таким логином уже существует');
        }
    }
    catch (err) {
       if (err) throw err;
    }
}

async function validateLogin(login, password) {
    if (!login || !password) {
        throw new Error('Не все поля заполнены');
    }
    try {
        const user = await User.getUser(login);
        if (user) {
            try {
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) throw new Error('Неверный логин или пароль. Password');
                return user;
            } catch (err) {
                if (err) throw err;
            }
        }
        throw new Error('Неверный логин или пароль. User');
    } catch (err) {
        if (err) throw err;
    }
}

async function regUser(request, response) {
    const {login, email, password, confirmPassword} = request.body;
    try {
        await validateReg(login, email, password, confirmPassword);
        const result = await User.insert({login, email, password});
        if(result) {
            response.json({ ok: true,  caption: 'Вы успешно зарегистрировались'});
        }
    }
    catch (err) {
        response.json({ ok: false, caption: err.message });
    }
}

async function login(request, response) {
    const {login, password, setSession} = request.body;
    try {
        const user = await validateLogin(login, password);
        if (setSession) {
            request.session.cookie.expires = 24 * 60 * 60 * 1000;
        }
        else {
            request.session.cookie.expires = false;
        }
        request.session.login = user.login;
        response.json({ok: true, caption: user});
    }
    catch (err) {
        response.json({ ok: false, caption: err.message});
    }
}


module.exports = { regUser, login };
