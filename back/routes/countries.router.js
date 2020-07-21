const express                       = require('express');
const router                        = express.Router();
const { countriesController }        = require('../controllers');


router.get('/all', countriesController.getAll);
router.post('/', countriesController.add);


module.exports = router;
