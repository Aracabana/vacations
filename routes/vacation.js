const express                       = require('express');
const router                        = express.Router();
const access                        = require('../routes/access');
const { vacationController }        = require('../controllers');
const { geoNames, countries } = require('../helpers/geonames');

router.get('/', access, async function(request, response) {
    try {
        const countryNames = await countries.getAll();
        console.log(countryNames);
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
            countryNames,
            script: 'create-vacation'
        });
    } catch (err) {
        response.json({
            ok: false,
            caption: err.message
        })
    }
});
router.get('/all', access, vacationController.getAllByUserId);


router.post('/', access, vacationController.save);



module.exports = router;
