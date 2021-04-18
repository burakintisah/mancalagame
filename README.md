# mancalagame

## [How to play mancala] (https://www.youtube.com/watch?v=OX7rj93m6o8) 

## Tech Stack
NodeJS, Express, MongoDB

## Explore Rest APIs  
  
The app defines following APIs.  

 - **`POST`** localhost:3000/games (Create game with 6 stones in each pit) 
 - **`GET`** localhost:3000/games (listing all games)  
 - **`GET`** localhost:3000/games/:gameID (getting the game information by id) 
 - **`PUT`** localhost:3000/games/:gameID/:playerID/:pitNo (make move by game id, player id and pit id) 
 - **`DELETE`** localhost:3000/games/:gameID (Delete game) 

## Example API call and body
**`POST`** localhost:3000/games
```json
{
    "playerOne": { "name": "player1"},
    "playerTwo": { "name": "player2"},
    "playerTurn": "player1"
}
```

## Note
- Clone this repository
- Go into project folder
- Run `npm i`
- Create `.env` file.
- Add `DB_CONNECTION=` and paste connection string taken from the mongodb website.
- Run `npm start`
