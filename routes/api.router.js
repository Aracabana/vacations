const express = require('express');
const { Vacation } = require("../models");
const router = express.Router();

router.get('/getVacations', async function(request, response) {
    const userId = request.session.userId;
    if (userId) {
        try {
            const vacations = await Vacation.getAllByUserId(userId);
            response.json({
                ok: true,
                vacations
            })
        } catch (err) {
            response.json({
                ok: false,
                caption: err.message
            });
        }
    }
});

module.exports = router;