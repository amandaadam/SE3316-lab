import './App.css';
import React, { Component } from 'react';

//create the holes
function Hole(props){ 
  return <div className="Hole"><div className={props.value}></div></div>
}

//create the slats 
function Slat(props){
    return <div className="Slat" onClick={() => props.handleClick()}>
      {[...Array(props.holes.length)].map((x, j) => 
        <Hole key={j} value={props.holes[j]}></Hole>)}
      </div>
 }

class Board extends Component {

  constructor() {
    super();
    this.state = {
      boardState: new Array(7).fill(new Array(6).fill(null)),
      playerTurn: 'Red',
      gameSelected: false,
      winner: '',
      moves: 0, //keep track of how many moves have been made
      isDraw: false,
    }
  }

  selectedGame(){
    this.setState({
       gameSelected: true, 
       boardState: new Array(7).fill(new Array(6).fill(null)),
       //when a new game is started, need to reset moves, isDraw, and Winner back starting values
       moves: 0, 
       isDraw: false,
       winner: ''
    })
  }

  makeMove(slatID){
    const boardCopy = this.state.boardState.map(function(arr) {
      return arr.slice();
    });
    if( boardCopy[slatID].indexOf(null) !== -1 ){
      let newSlat = boardCopy[slatID].reverse()
      newSlat[newSlat.indexOf(null)] = this.state.playerTurn
      newSlat.reverse()
      const newMoves = this.state.moves + 1; //counter to keep track of number of moves

      this.setState({
        playerTurn: (this.state.playerTurn === 'Red') ? 'Yellow' : 'Red',
        boardState: boardCopy,
        moves: newMoves,
      })
    }
  }

  //make a move if there is still no winner
  handleClick(slatID) {
    if(this.state.winner === ''){
      this.makeMove(slatID)
    }
  }
  
  //check the game status on every update
  componentDidUpdate(){
    //use checkWinner function 
    let winner = checkWinner(this.state.boardState);

    console.log(this.state.moves);

    //check if draw
    if (this.state.moves === 42 && !this.state.isDraw) {
      this.setState({isDraw: true});
    }

    //check if winner
    if(this.state.winner !== winner){
      this.setState({winner: winner})
    }
  }

  render(){

    //If the game is over, display message
    let endMessage
    if(this.state.winner !== "" || this.state.isDraw){
      endMessage = "winnerMessage appear"
    } 
   
    //Create board with slats and holes
    let slats = [...Array(this.state.boardState.length)].map((x, i) => 
      <Slat 
          key={i}
          holes={this.state.boardState[i]}
          handleClick={() => this.handleClick(i)}
      ></Slat>
    )

    return ( //display the board, the end message, and play button
      <div>
        {this.state.gameSelected &&
          <div className="Board">
            {slats}
          </div>
        }
        <div className={endMessage}>{this.state.isDraw ? 'Draw!' : this.state.winner}</div>
        {(!this.state.gameSelected || this.state.winner !== '' || this.state.isDraw) &&
          <div>
            <button onClick={() => this.selectedGame('Play')}>Let's Play!</button>
          </div>
        }
      </div>
    )
  }
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Connect-4 Game</h2>
        </div>
        <div className="Game">
          <Board></Board>
        </div>
      </div>
    );
  }
}

//function to check lines and return a boolean value
function checkLine(a,b,c,d) {
    return ((a !== null) && (a === b) && (a === c) && (a === d));
}

//function to check if there is a winner
function checkWinner(bs) {
    for (let c = 0; c < 7; c++)
        for (let r = 0; r < 4; r++)
            if (checkLine(bs[c][r], bs[c][r+1], bs[c][r+2], bs[c][r+3]))
                return bs[c][r] + ' wins!'

    for (let r = 0; r < 6; r++)
         for (let c = 0; c < 4; c++)
             if (checkLine(bs[c][r], bs[c+1][r], bs[c+2][r], bs[c+3][r]))
                 return bs[c][r] + ' wins!'

    for (let r = 0; r < 3; r++)
         for (let c = 0; c < 4; c++)
             if (checkLine(bs[c][r], bs[c+1][r+1], bs[c+2][r+2], bs[c+3][r+3]))
                 return bs[c][r] + ' wins!'

    for (let r = 0; r < 4; r++)
         for (let c = 3; c < 6; c++)
             if (checkLine(bs[c][r], bs[c-1][r+1], bs[c-2][r+2], bs[c-3][r+3]))
                 return bs[c][r] + ' wins!'

    return "";
}

export default App;
