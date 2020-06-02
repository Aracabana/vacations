const express                = require('express');
const router                 = express.Router();
const access                 = require('../routes/access');
const { vacationController } = require('../controllers');

router.get('/', access, function(request, response) {
    response.render('create-vacation', {
        pageTitle: 'Создать отпуск',
        title: 'Создать отпуск',
        login: request.session.login,
        btn: {
            link: '/',
            title: 'Вернуться к списку отпусков',
            icon: 'fa-angle-left',
            class: 'btn-light'
        },
        script: 'create-vacation'
    });
});
router.get('/all', access, vacationController.getAllByUserId);


router.post('/', access, vacationController.save);



module.exports = router;
