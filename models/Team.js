const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    coach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    league: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'leagues'
    },
    wins: {
        type: Number,
        default: 0
    },
    losses: {
        type: Number,
        default: 0
    },
    Ties: {
        type: Number,
        default: 0
    },
    roster: [
        {
            player: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ]

});

module.exports = Team = mongoose.model('team', TeamSchema);