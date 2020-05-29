const express = require('express');
const router = express.Router();

router.get('/login', function(request, response) {
    response.render('login', {
        layout: 'auth',
        pageTitle: 'Авторизация'
    })
});
router.post('/login', function(request, response) {
    console.log(new Date());
    console.log(request.body);
});

router.get('/registration', function(request, response) {
    response.render('registration', {
        layout: 'auth',
        pageTitle: 'Регистрация'
    })
});
router.post('/registration', function(request, response) {

});


module.exports = router;
