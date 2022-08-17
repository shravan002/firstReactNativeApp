import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, Button, StyleSheet} from 'react-native';
import RandomNumber from './RandomNumber';
import shuffle from 'lodash.shuffle';

class Game extends React.Component {
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
    onWinning: PropTypes.func.isRequired,
    score: PropTypes.number.isRequired,
  };
  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  };
  gameStatus = 'PLAYING';
  randomNumber = Array.from({length: this.props.randomNumberCount}).map(
    () => 1 + Math.floor(10 * Math.random()),
  );
  target = this.randomNumber
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);
  suffledRandomNumbers = shuffle(this.randomNumber);

  isNumberSelected = numberIndex => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };
  selectNumber = numberIndex => {
    this.setState(prevState => ({
      selectedIds: [...prevState.selectedIds, numberIndex],
    }));
  };
  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (
      nextState.selectedIds !== this.state.selectedIds ||
      nextState.remainingSeconds === 0
    ) {
      this.gameStatus = this.calcGameStatus(nextState);
      if (this.gameStatus !== 'PLAYING') {
        clearInterval(this.intervalId);
      }
    }
  }
  calcGameStatus = nextState => {
    const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.suffledRandomNumbers[curr];
    }, 0);
    if (nextState.remainingSeconds === 0) {
      return 'LOST';
    }
    if (sumSelected < this.target) {
      return 'PLAYING';
    }
    if (sumSelected === this.target) {
      this.props.onWinning();
      return 'WON';
    }
    if (sumSelected > this.target) {
      return 'LOST';
    }
  };
  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(
        prevState => {
          return {remainingSeconds: prevState.remainingSeconds - 1};
        },
        () => {
          if (this.state.remainingSeconds === 0) {
            clearInterval(this.intervalId);
          }
        },
      );
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }
  onPressButtonHandler() {}
  render() {
    const gameStatus = this.gameStatus;
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
          {this.target}
        </Text>
        <View style={styles.randomContainer}>
          {this.suffledRandomNumbers.map((suffledRandomNumbers, index) => (
            <RandomNumber
              key={index}
              id={index}
              number={suffledRandomNumbers}
              isDisabled={
                this.isNumberSelected(index) || gameStatus != 'PLAYING'
              }
              onPress={this.selectNumber}
            />
          ))}
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.score}>Score: {this.props.score}</Text>
        </View>
        <Button onPress={this.props.onPlayAgain} title="Play Again" />
        <Text>{this.state.remainingSeconds}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
    paddingTop: 20,
  },
  target: {
    fontSize: 40,
    marginHorizontal: 50,
    textAlign: 'center',
  },
  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  STATUS_PLAYING: {
    backgroundColor: '#aaa',
  },
  STATUS_WON: {
    backgroundColor: 'green',
  },
  STATUS_LOST: {
    backgroundColor: 'red',
  },
  scoreBox: {
    flex: 0.5,
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginHorizontal: 70,
    marginVertical: 100,
    textAlign: 'center',
    backgroundColor: 'yellow',
    paddingTop: 20,
  },
  score: {
    fontSize: 35,
  },
});

export default Game;
