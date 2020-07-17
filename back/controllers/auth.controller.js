const { User } = require('../models');
const { registerValidator, loginValidator } = require('../helpers/validators');

async function register(request, response) {
    const {login, email, password, confirmPassword} = request.body;
    try {
        await registerValidator.validate(login, email, password, confirmPassword);
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
        const user = await loginValidator.validate(login, password);
        if (setSession) {
            request.session.cookie.expires = 14 * 24 * 60 * 60 * 1000;
        }
        else {
            request.session.cookie.expires = false;
        }
        request.session.userId = user.id;
        request.session.login = user.login;
        response.json({ok: true, caption: 'Вы успешно авторизовались', user: {login: user.login}});
    }
    catch (err) {
        response.json({ ok: false, caption: err.message});
    }
}
function logout (request, response) {
    request.session.destroy(() => {
        response.json({ok:true});
    });
}
function checkAuth(request, response) {
    if (!request.session.login) {
        response.json({status: false});
        return;
    }
    response.json({status: true});
}

module.exports = { register, login, logout, checkAuth };
