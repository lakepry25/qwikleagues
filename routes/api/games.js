const express = require('express');
const router = express.Router();
const Team = require('../../models/Team');
const League = require('../../models/League');
const User = require('../../models/User');
const Game = require('../../models/Game');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

// @route GET api/games
// @desc Get all games
// @access Private
router.get('/', auth, async (req, res) => {
    try {
        const games = await Game.find();
        res.json({ games: games });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route GET api/games/league/:id
// @desc Get all games for a league
// @access Private
router.get('/league/:id', auth, async (req, res) => {
    try {
        const league = await League.findById(req.params.id);

        //check if not team
        if (!league) {
            return res.status(404).json({ msg: 'League not found' });
        }

        const games = await Game.find({league: {$eq: league}});

        res.json({games: games});
    } catch (err) {
        console.error(err.message);

        if (!err.kind ==='ObjectId') {
            return res.status(404).json({ msg: 'League not found' });
        }

        res.status(500).send('Server Error');
    }
});


// @route GET api/games/team/:id
// @desc Get all games for a team
// @access Private
router.get('/team/:id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ msg: 'Team not found' });
        }

        const homeGames = await Game.find({homeTeam: {$eq: team}});
        const awayGames = await Game.find({awayTeam: {$eq: team}});

        const games = [...homeGames, ...awayGames];
        games.sort((a,b) => a.startDate - b.startDate);

        res.json({games: games});
    } catch (err) {
        console.error(err.message);

        if (!err.kind ==='ObjectId') {
            return res.status(404).json({ msg: 'Team not found' });
        }

        res.status(500).send('Server Error');
    }
});


// @route POST api/games
// @desc Create a game
// @access Private
router.post('/', 
    [
        auth,
        [
            check('homeTeam', 'Home Team is required')
                .not()
                .isEmpty(),
            check('awayTeam', 'Away Team is required')
                .not()
                .isEmpty(),
            check('startTime', 'Start Time is required')
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
            // NEED TO CHECK IF USER IS LEAGUE OWNER

            const homeTeam = await Team.findById(req.body.homeTeam);
            const awayTeam = await Team.findById(req.body.awayTeam);

            if (!homeTeam) {
                return res.status(404).json({ msg: 'Home Team not found' });
            }

            if (!awayTeam) {
                return res.status(404).json({ msg: 'Away Team not found' });
            }
            
            if (!homeTeam.league.equals(awayTeam.league)) {
                return res.status(400).json({ msg: 'Teams are not from the same league'});
            }

            const newGame = new Game({
                homeTeam: homeTeam.id,
                awayTeam: awayTeam.id,
                league: homeTeam.league,
                startTime: req.body.startTime
            });

            const game = await newGame.save();
            res.json(game);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
        
    }
);

// Schedule games for a league
// Delete/Cancel a game
// Set score
// Approve score

module.exports = router;