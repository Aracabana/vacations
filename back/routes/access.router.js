const express = require('express');
const router = express.Router();

router.use(function(request, response, next) {
    if (!request.session.login) {
        response.redirect('/auth/login')
        return;
    }
    next();
});

module.exports = router;
