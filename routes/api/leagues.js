const express = require('express');
const router = express.Router();
const League = require('../../models/League');
// const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');


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
            // const user = await User.findById(req.user.id).select('-password');
            console.log(req.body.name);

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

// @route GET api/teams
// @desc Test Route
// @access Public
router.get('/', (req, res) => res.send('League Route'));

module.exports = router;