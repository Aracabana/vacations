const express                   = require('express');
const router                    = express.Router();
const {
    apiController,
    vacationController,
    widgetController
}                               = require('../controllers');


router.get('/getVacations', vacationController.getAll);
router.get('/getVacation', vacationController.getOne);
router.get('/getGeoJSON', apiController.getGeoJSON);
router.get('/getWidgets', widgetController.getAll);

router.post('/getCountry', apiController.getCountry);
router.post('/saveWidget', widgetController.insert);

router.delete('/removeWidget', widgetController.remove);


module.exports = router;
