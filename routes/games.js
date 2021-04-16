const express = require('express');
const router = express.Router();
const GameModel = require('../models/GameModel');


// Getting the list of all the games
router.get('/', async (req, res) => {
    try {
        const games = await GameModel.find();
        res.json(games);
    } catch (err) {
        res.json({ message: err });
    }
});

// Creating a new game
router.post('/', async (req, res) => {
    const game = new GameModel({
        playerOne: {
            name: req.body.playerOne.name,
        },
        playerTwo: {
            name: req.body.playerTwo.name
        },
        playerTurn: req.body.playerTurn,
        gameStatus: req.body.gameStatus,
        winnerPlayer: req.body.winnerPlayer,
    });
    try {
        const savedGame = await game.save();
        res.json(savedGame);
    } catch (err) {
        res.json({ message: err })
    }

});

// Getting the game information from GAME_ID 
// assumed that we have a ui and after all of the games showed he can click on the game
router.get('/:gameID', async (req, res) => {
    try {
        const game = await GameModel.findById(req.params.gameID);
        res.json(game);
    } catch (err) {
        res.json({ message: err });
    }
});

// Deleting the game 
router.delete('/:gameID', async (req, res) => {
    try {
        const removedGame = await GameModel.remove(
            { _id: req.params.gameID });
        res.json(removedGame);
    } catch (err) {
        res.json({ message: err });

    }
});

// TODO: returning the error with the its code! 

// Making a move
router.put('/:gameID/:player/:pitNo', async (req, res) => {

    try {
        const game = await GameModel.findById(req.params.gameID);

        // playedPit
        var playedPit = req.params.pitNo - 1;

        if (playedPit > 5) {
            res.json({ message: 'You have to pick from first 6 pits which are on your side of the board.' });
            return;
        }
        else if (playedPit < 0) {
            res.json({ message: 'Number should be nonnegative.' });
            return;
        }

        if (game.gameStatus === 'CREATED') {
            if (game.playerTurn === req.params.player) {
                var player, opponent;

                if (game.playerTurn === game.playerOne.name) {
                    player = game.playerOne;
                    opponent = game.playerTwo;
                }
                else if (game.playerTurn === game.playerTwo.name) {
                    player = game.playerTwo;
                    opponent = game.playerOne;
                }

                // Getting the pits of the game
                var pits = player.pit;
                var othersPits = opponent.pit;

                // creating the pits that the rocks will be putted
                // my pits + my mancala + opponents pits
                // This is where user can put its rocks 
                pits.push(player.mancala);
                var temp = pits.concat(othersPits);

                // getting the number of rocks
                var countRock = temp[playedPit]
                temp[playedPit] = 0;

                if (countRock === 0) {
                    res.json({ message: 'Pit is empty, select another pit.' })
                    return;
                }

                // Finding the result mancala game 

                while (countRock-- > 0) {
                    playedPit++
                    playedPit = playedPit % 13
                    temp[playedPit]++;
                }

                var nextTurn = player.name;
                if (playedPit != 6) {
                    nextTurn = opponent.name;
                }

                // when you put your rock on empty pit on your side
                if (playedPit < 6 && temp[playedPit] == 1) {
                    var takeAll = temp[playedPit] + temp[12 - playedPit];
                    temp[playedPit] = 0;
                    // taking the opposite site's rocks
                    temp[12 - playedPit] = 0;
                    temp[6] += takeAll;
                }

                var player_pits = temp.splice(0, 6);
                var cur_mancala = temp.splice(0, 1)[0];
                var opponent_pit = temp.splice(0, 6);

                var game_status = game.gameStatus;
                var winner = game.winner;

                // Just making sure that we are adding the correct data to the correct place 
                var playerOne_man = game.playerOne.mancala;
                var playerTwo_man = game.playerTwo.mancala;

                //according to whose turn the player and opponent changes
                //updating the pits accordingly
                var playerOnePits, playerTwoPits;
                if (game.playerTurn === game.playerOne.name) {
                    playerOnePits = player_pits;
                    playerTwoPits = opponent_pit;
                    playerOne_man = cur_mancala;
                }
                else {
                    playerOnePits = opponent_pit;
                    playerTwoPits = player_pits;
                    playerTwo_man = cur_mancala;
                }

                if (player_pits.every(item => item === 0) ) {
                    game_status = 'FINISHED';

                    var cur = player_pits.reduce((a, b) => a + b, 0) + cur_mancala;
                    var opponent = opponent_pit.reduce((a, b) => a + b, 0) + opponent.mancala;

                    if (cur > opponent) winner = player.name;
                    else winner = opponent.name;
                }

                const updatedGame = await GameModel.updateOne(
                    { _id: req.params.gameID },
                    {
                        $set:
                        {
                            playerOne: {
                                name: game.playerOne.name,
                                pit: playerOnePits,
                                mancala: playerOne_man,
                            },
                            playerTwo: {
                                name: game.playerTwo.name,
                                pit: playerTwoPits,
                                mancala: playerTwo_man,
                            },
                            playerTurn: nextTurn,
                            gameStatus: game_status,
                            winnerPlayer: winner
                        }
                    });
                res.json(updatedGame);

            }
            else {
                res.json({ message: 'It is not ' + req.params.player + ' turn.' });
                return;
            }
        }
        else {
            res.json({message: 'The game is already finished.'});
            return;
        }

    } catch (err) {
        res.json({ message: err });
    }
});


module.exports = router;