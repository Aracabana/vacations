const express                       = require('express');
const router                        = express.Router();
const { vacationController }        = require('../controllers');

router.get('/', vacationController.getPage);
router.get('/all', vacationController.getAllByUserId);
router.post('/', vacationController.add);

module.exports = router;
