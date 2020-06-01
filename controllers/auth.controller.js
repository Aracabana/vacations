const { User } = require('../models');

const fields = ['login', 'email', 'password', 'confirmPassword'];
function setInvalidFields(fields, condition) {
    fields.forEach(condition);
}

async function validateReg(login, email, password, confirmPassword) {
    let invalidFields = [];
    if (!login || !email || !password || !confirmPassword) {
        setInvalidFields([login, email, password, confirmPassword], (item, index) => {
            if (!item) {
                invalidFields.push(fields[index]);
            }
        });
        return {
            ok: false,
            caption: 'Поле обязательно для заполнения',
            fields: invalidFields
        }
    }
    if (login.length < 4) {
        return {
            ok: false,
            caption: 'Поле должно содержать больше 3-х символов',
            fields: ['login']
        }
    }
    if (password.length < 4) {
        return {
            ok: false,
            caption: 'Поле должно содержать больше 3-х символов',
            fields: ['password']
        }
    }
    const emailRegExp = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/gi;
    if (!emailRegExp.test(email)) {
        return {
            ok: false,
            caption: 'Неверный E-mail',
            fields: ['email']
        }
    }
    if (password !== confirmPassword) {
        return {
            ok: false,
            caption: 'Пароли не совпадают',
            fields: ['confirmPassword']
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

function validateLogin(request, response) {
    const {name, password, setSession} = request.body;
    if (!name || !password) {
        response.json({
            ok: false,
            caption: 'Не все поля заполнены',
            fields: ['login', 'password']
        });
        return 0;
    }
}



module.exports = { regUser, validateLogin };
