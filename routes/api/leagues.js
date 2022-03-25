const express = require('express');
const router = express.Router();

// @route GET api/leagues
// @desc Test Route
// @access Public
router.get('/', (req, res) => res.send('League Route'));

module.exports = router;