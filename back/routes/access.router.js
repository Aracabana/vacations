const express = require('express');
const router = express.Router();

router.use(function(request, response, next) {
    if (!request.session.login) {
        response.status(401).json({ok: false, caption: 'Вы не авторизованы'});
        return;
    }
    next();
});

module.exports = router;
