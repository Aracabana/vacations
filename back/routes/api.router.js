const express                   = require('express');
const widgetsRouter             = require('./widgets/widgets.router');
const {
    apiController,
    vacationController
}                               = require('../controllers');
const router                    = express.Router();

router.use('/widgets', widgetsRouter);

router.get('/getVacations', vacationController.getAll);
router.get('/getVacation', vacationController.getOne);
router.get('/getGeoJSON', apiController.getGeoJSON);
router.get('/getCountriesForSelect', apiController.getCountriesForSelect);

router.post('/getCountry', apiController.getCountry);
router.post('/loadAll', apiController.loadAll);
router.get('/getAllCountries', apiController.getAllCountries);


module.exports = router;
