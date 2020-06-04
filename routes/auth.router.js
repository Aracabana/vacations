const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');

router.get('/registration', authController.registrationPage);
router.get('/login', authController.loginPage);
router.get('/logout', authController.logout);

router.post('/registration', authController.register);
router.post('/login', authController.login);


module.exports = router;
