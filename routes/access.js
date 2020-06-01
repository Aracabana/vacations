const express = require('express');
const router = express.Router();

router.use(function(request, response, next) {

    console.log(request.cookies);
    if (!request.cookies.username) {
        response.redirect('/auth/login');
        return;
    }
    next();
});

module.exports = router;
