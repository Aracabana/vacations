const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');


router.post('/registration', authController.register);
router.post('/login', authController.login);
router.get('/checkAuth', authController.checkAuth);

router.get('/logout', authController.logout);


module.exports = router;
