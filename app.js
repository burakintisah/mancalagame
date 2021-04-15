const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// reaching out to the database configurations
require('dotenv/config');

//Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors())


// Import Routes
const gameRoute = require ('./routes/games');
const {remove} = require('./models/GameModel')
app.use('/games', gameRoute); 

// Connecting to MongoDB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true , useUnifiedTopology: true }, 
    () => console.log('Connected to MongoDB')
);

// listening the server
app.listen(3000);