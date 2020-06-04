const express                   = require('express');
const router                    = express.Router();
const { apiController }         = require('../controllers');
const { vacationController }    = require('../controllers');

router.get('/getVacations', vacationController.getAll);
router.get('/getGeoJSON', apiController.getGeoJSON);

router.post('/getCountry', apiController.getCountry);



module.exports = router;