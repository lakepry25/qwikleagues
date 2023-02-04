const mongoose = require('mongoose');

const LeagueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    type: {
        type: Number, // 0 -> League, 1 -> Tournament, 2 -> League w/o playoffs
        required: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    registrationCutoff: {
        type: Date
    },
    numberOfPlayoffTeams: {
        type: Number
    }

});

module.exports = League = mongoose.model('league', LeagueSchema);