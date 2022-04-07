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
    settings: {
        
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        },
        registrationCutoff: {
            type: Date
        },
    }

});

module.exports = League = mongoose.model('league', LeagueSchema);