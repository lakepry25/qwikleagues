const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    league: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'league',
        required: true
    },
    homeTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teams',
        required: true
    },
    awayTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teams',
        required: true
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