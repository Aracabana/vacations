const express                       = require('express');
const router                        = express.Router();
const { vacationController }        = require('../controllers');


router.post('/', vacationController.add);
router.put('/', vacationController.edit);
router.delete('/', vacationController.remove);


module.exports = router;
