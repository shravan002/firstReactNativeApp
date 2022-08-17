import React from 'react';
import Game from './Game';

class App extends React.Component {
  state = {
    gameId: 1,
    score: 0,
  };
  resetGame = () => {
    this.setState(prevState => {
      return {gameId: prevState.gameId + 1};
    });
  };
  resetScore = () => {
    this.setState(prevState => {
      return {score: prevState.score + 1};
    });
  };
  render() {
    return (
      <Game
        key={this.state.gameId}
        onPlayAgain={this.resetGame}
        onWinning={this.resetScore}
        randomNumberCount={6}
        initialSeconds={15}
        score={this.state.score}
      />
    );
  }
}

export default App;
