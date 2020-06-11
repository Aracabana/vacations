const express                       = require('express');
const router                        = express.Router();
const { vacationController }        = require('../controllers');

router.get('/', vacationController.createVacationPage);
router.get('/:id', vacationController.vacationPage);
router.post('/', vacationController.add);
router.put('/', vacationController.edit);
router.delete('/', vacationController.remove);

module.exports = router;
