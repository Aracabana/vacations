const express                   = require('express');
const { widgetController }      = require('../../controllers');

const router                    = express.Router();


router.get('/', widgetController.getAll);
router.post('/', widgetController.insert);
router.delete('/', widgetController.remove);

router.get('/budgetInfo', widgetController.getBudgetInfoByVacationId)


module.exports = router;
