const { User } = require('../../models');
const bcrypt = require('bcrypt');

async function validate(login, password) {
    if (!login || !password) {
        throw new Error('Не все поля заполнены');
    }
    try {
        const user = await User.getOne('login',login);
        if (user) {
            try {
                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) throw new Error('Неверный логин или пароль');
                return user;
            } catch (err) {
                if (err) throw err;
            }
        }
        throw new Error('Неверный логин или пароль');
    } catch (err) {
        if (err) throw err;
    }
}

module.exports = { validate };
