const express = require('express');
const router = express.Router();
const Team = require('../../models/Team');
const League = require('../../models/League');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');


// @route GET api/teams
// @desc Get all teams
// @access Private
router.get('/', auth, async (req, res) => {
    try {
        const teams = await Team.find();
        res.json({ teams: teams });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route GET api/teams/:id
// @desc Get team by ID
// @access Private
router.get('/:id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        //check if not team
        if (!team) {
            return res.status(404).json({ msg: 'Team not found' });
        }

        res.json(team);
    } catch (err) {
        console.error(err.message);

        if (!err.kind ==='ObjectId') {
            return res.status(404).json({ msg: 'Team not found' });
        }

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
            const teams = await Team.find({"league": req.body.league});

            // Check to make sure the team name hasn't been used
            if (teams.filter(team => team.name === req.body.name).length > 0) {
                return res.status(400).json({ msg: 'Team name already in use for this league'});
            }

            // **** THIS PROBABLY COULD BE BETTER ****
            let userOnTeam = false;
            teams.forEach(team => {
                if (team.roster.filter(player => player.playerID === req.user.id).length > 0) {
                    userOnTeam = true;
                }
            });

            if (userOnTeam) {
                return res.status(400).json({ msg: "User already on team in this league"});
            }

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

// @route PUT api/teams/leave/:id
// @desc leave a team
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

// @route PUT api/teams/kick/:id/:player
// @desc Kick player from a team
// @access Private
router.put('/kick/:id/:player', auth, async (req, res) => {
    try {

        const team = await Team.findById(req.params.id);
        const playerToRemove = await User.findById(req.params.player);
        
        if (!team) {
            return res.status(404).json({ msg: 'Team not found' });
        }

        if (!playerToRemove) {
            return res.status(404).json({ msg: 'Player not found' });
        }

        // Check if user making request is coach
        if (team.coach.toString() !== req.user.id){
            return res.status(404).json({ msg: 'User is not coach of team'});
        }

        // Check if user is already on the team
        if (team.roster.filter(player => player.playerID === playerToRemove.id).length === 0) {
            return res.status(400).json({ msg: 'User not on this team'});
        }

        // Get remove index
        const removeIndex = team.roster.map(player => player.playerID.toString()).indexOf(playerToRemove.id);

        team.roster.splice(removeIndex, 1);

        await team.save();

        res.json(team.roster);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route DELETE api/teams/:id
// @desc Delete/Remove a Team
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        const league = await League.findById(team.id);

        if (!team) {
            return res.status(404).json({ msg: 'Team not found' });
        }

        // Check user
        if(team.coach.toString() !== req.user.id && league.organizer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await team.remove();
        

        res.json({ msg: 'Team removed' });
    } catch (err) {
        console.error(err.message);

        if (!err.kind ==='ObjectId') {
            return res.status(404).json({ msg: 'Team not found' });
        }

        res.status(500).send('Server Error');
    }
});



module.exports = router;