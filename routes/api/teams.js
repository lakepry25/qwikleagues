const express = require('express');
const router = express.Router();

// @route GET api/teams
// @desc Test Route
// @access Public
router.get('/', (req, res) => res.send('Team Route'));

module.exports = router;