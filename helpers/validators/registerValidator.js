const { User } = require('../../models');

async function validate(login, email, password, confirmPassword) {
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
        const userByLogin = await User.getOne('login', login);
        const userByMail = await User.getOne('email', email);
        if (userByLogin) {
            throw new Error('Пользователь с таким логином уже существует');
        }
        if (userByMail) {
            throw new Error('Пользователь с таким email уже существует');
        }
    }
    catch (err) {
        if (err) throw err;
    }
}

module.exports = { validate };
