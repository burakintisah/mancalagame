const mongoose = require('mongoose');

const PlayerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
});

//TODO: number of wins etc can be added

module.exports.PlayerSchema = PlayerSchema;
module.exports.PlayerModel = mongoose.model('Players', PlayerSchema);
