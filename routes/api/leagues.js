const express = require('express');
const router = express.Router();
const League = require('../../models/League');
const Team = require('../../models/Team');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

// @route GET api/leagues
// @desc Get all leagues
// @access Public
router.get('/', async (req, res) => {
    try {
        const leagues = await League.find();
        res.json({ leagues: leagues });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST api/leagues
// @desc Create a league
// @access Private
router.post('/', 
    [
        auth,
        [
            check('name', 'League name is required')
                .not()
                .isEmpty()
        ]
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty){
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newLeague = new League({
                name: req.body.name,
                organizer: req.user.id
            });

            const league = await newLeague.save();
            res.json(league);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
        
    }
);

// Delete a league
// Update league settings


module.exports = router;