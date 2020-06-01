const { User } = require('../models');
const bcrypt = require('bcrypt');

async function validateReg(login, email, password, confirmPassword) {
    if (!login || !email || !password || !confirmPassword) {
        return {
            ok: false,
            caption: 'Поле обязательно для заполнения'
        }
    }
    if (login.length < 4) {
        return {
            ok: false,
            caption: 'Поле должно содержать больше 3-х символов'
        }
    }
    if (password.length < 4) {
        return {
            ok: false,
            caption: 'Поле должно содержать больше 3-х символов'
        }
    }
    const emailRegExp = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/gi;
    if (!emailRegExp.test(email)) {
        return {
            ok: false,
            caption: 'Неверный E-mail'
        }
    }
    if (password !== confirmPassword) {
        return {
            ok: false,
            caption: 'Пароли не совпадают'
        }
    }
    const user = await User.getUser(login);
    if (user.length) {
        return {
            ok: false,
            caption: 'Пользователь с таким логином уже существует'
        }
    }
    return {
        ok: true
    };
}
async function regUser(request, response) {
    const {login, email, password, confirmPassword} = request.body;
    const validateError = await validateReg(login, email, password, confirmPassword);
    if (!validateError.ok) {
        response.json(validateError);
        return 0;
    }
    const result = await User.insert({login, email, password});
    if (result) {
        response.json({
            ok: true,
            caption: 'Вы успешно зарегистрировались'
        });
    }
}

async function login(request, response) {
    const {login, password, setSession} = request.body;
    const validateError = await validateLogin(login, password);
    console.log(validateError);
    if (!validateError.ok) {
        response.json(validateError);
        return 0;
    }
}

async function validateLogin(login, password) {
    if (!login || !password) {
        return {
            ok: false,
            caption: 'Не все поля заполнены'
        }
    }
    const user = await User.getUser(login);
    if (user.length) {
        try {
            const isValid = await bcrypt.compare(password, user[0].password);
            console.log(isValid);
            if (!isValid) {
                return {
                    ok: false,
                    caption: 'Неверный логин или пароль'
                }
            }
            return {
                ok: true,
                caption: 'Вы успешно авторизовались!'
            }
        } catch (e) {
            console.log(e);
            // if (e) throw e;
        }
    }
}



module.exports = { regUser, login };
