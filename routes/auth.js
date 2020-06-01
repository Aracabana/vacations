const express = require('express');
const router = express.Router();
const Geonames = require('geonames.js')

router.get('/login', function(request, response) {
    response.render('login', {
        layout: 'auth',
        pageTitle: 'Авторизация'
    })
});
router.post('/login', function(request, response) {
    console.log(request.body);
    const { name, password } = request.body;
    // if(!name || !password) {
    //     response.json({ ok: false, caption: 'Invalid Data' });
    //     return;
    // }
    // response.json({ ok: true, caption: 'Data is valid'});
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
