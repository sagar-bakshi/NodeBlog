const express = require('express');
const router = express.Router();

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
})


module.exports = router;
