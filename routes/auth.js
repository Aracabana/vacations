const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
// const Geonames = require('geonames.js');

router.get('/login', function(request, response) {
    response.render('login', {
        layout: 'auth',
        pageTitle: 'Авторизация'
    })
});
router.post('/login', authController.login);

router.get('/registration', function(request, response) {
    response.render('registration', {
        layout: 'auth',
        pageTitle: 'Регистрация'
    })
});
router.post('/registration', authController.regUser);


module.exports = router;
