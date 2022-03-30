const express = require('express');
const router = express.Router();
const Team = require('../../models/Team');
const League = require('../../models/League');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');


// @route GET api/teams
// @desc Get all teams
// @access Public
router.get('/', async (req, res) => {
    try {
        const teams = await Team.find().sort({ date: -1 });
        res.json({ teams: teams });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST api/teams
// @desc Create a team
// @access Private
router.post('/', 
    [
        auth,
        [
            check('name', 'Team name is required')
                .not()
                .isEmpty(),
            check('league', 'Team must be assigned to a league')
                .not()
                .isEmpty(),
        ]
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty){
            return res.status(400).json({ errors: errors.array() });
        }

        try {

            // This might be redundant
            const league = await League.findById(req.body.league);

            const newTeam = new Team({
                name: req.body.name,
                league: league.id,
                coach: req.user.id
            });

            const team = await newTeam.save();
            res.json(team);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
        
    }
);

// @route PUT api/teams/join/:id
// @desc Join a team
// @access Private
router.put('/join/:id', auth, async (req, res) => {
    try {

        const team = await Team.findById(req.params.id);
        
        if (!team) {
            return res.status(404).json({ msg: 'Team not found' });
        }

        // Check if user is already on the team
        if (team.roster.filter(player => player.playerID === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'User already on team'});
        }

        team.roster.push({ playerID: req.user.id });

        await team.save();

        res.json(team.roster);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route PUT api/teams/join/:id
// @desc Join a team
// @access Private
router.put('/leave/:id', auth, async (req, res) => {
    try {

        const team = await Team.findById(req.params.id);
        
        if (!team) {
            return res.status(404).json({ msg: 'Team not found' });
        }

        // Check if user is already on the team
        if (team.roster.filter(player => player.playerID === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'User not on this team'});
        }


        // Get remove index
        const removeIndex = team.roster.map(player => player.playerID.toString()).indexOf(req.user.id);

        team.roster.splice(removeIndex, 1);

        await team.save();

        res.json(team.roster);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;