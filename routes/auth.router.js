const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');

router.get('/login', function(request, response) {
    response.render('login', {
        layout: 'auth',
        pageTitle: 'Авторизация',
        scripts: ['validator', 'auth']
    })
});
router.post('/login', authController.login);

router.get('/registration', function(request, response) {
    response.render('registration', {
        layout: 'auth',
        pageTitle: 'Регистрация',
        scripts: ['validator', 'auth']
    })
});
router.post('/registration', authController.regUser);


module.exports = router;
