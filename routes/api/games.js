const express = require('express');
const router = express.Router();

// @route GET api/games
// @desc Test Route
// @access Public
router.get('/', (req, res) => res.send('Game Route'));

module.exports = router;