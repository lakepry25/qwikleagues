const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    homeTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teams'
    },
    awayTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teams'
    },
    startTime: {
        type: Date,
        required: true
    },
    homeScore: {
        type: Number,
        default: 0
    },
    awayScore: {
        type: Number,
        default: 0
    },
    isApproved: {
        type: Boolean,
        default: false
    }
});

module.exports = Game = mongoose.model('game', GameSchema);