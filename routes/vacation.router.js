const express                       = require('express');
const router                        = express.Router();
const { vacationController }        = require('../controllers');

router.get('/', vacationController.createPage);
router.get('/:id', vacationController.vacationPage);
router.post('/', vacationController.add);

module.exports = router;
