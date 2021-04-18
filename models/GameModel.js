const mongoose = require('mongoose');
const { playerSchema, playerModel } = require('./PlayerModel.js');

//TODO:  player is going to be a different schema
const GamesSchema = mongoose.Schema({
    playerOne: {
        name: {
            type: String,
            required: true
        },
        pit: {
            type: [Number],
            default: [6,6,6,6,6,6],
        },
        mancala: {
            type: Number,
            default: 0
        }
    },
    playerTwo: {
        name: {
            type: String,
            required: true
        },
        pit: {
            type: [Number],
            default: [6,6,6,6,6,6],
        },
        mancala: {
            type: Number,
            default: 0
        }
    },
    playerTurn: {
        type: String,
        required: true
    },
    gameStatus: {
        type: String,
        enum: ['CREATED', 'FINISHED'],
        default: 'CREATED'
    },
    winnerPlayer: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Games', GamesSchema);