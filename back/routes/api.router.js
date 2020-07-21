const express                   = require('express');
const widgetsRouter             = require('./widgets/widgets.router');
const {
    apiController,
    vacationController,
    countriesController
}                               = require('../controllers');
const router                    = express.Router();

router.use('/widgets', widgetsRouter);

// router.get('/getVacations', vacationController.getAll);
router.get('/getVacation', vacationController.getOne);
router.get('/getCountry', countriesController.getOne);
router.get('/getGeoJSON', apiController.getGeoJSON);


module.exports = router;
