import React from 'react';
import './App.css';
import {Header} from './components/Header';
import Player from './components/Player';
import AddPlayerForm from "./components/AddPlayerForm";
import {connect, useSelector} from "react-redux";
import {CustomPlayer} from "./components/CustomPlayer";
import _ from 'lodash';

let maxId = 4;

function App() {
  const players = useSelector(state => state.playerReducer.players);

  //  return: highScore
  const isHighScore = () => {
    return _.maxBy(players, 'score').score;
  }

  return (
    <div className="scoreboard">
      <Header title="My Scoreboard" players={players} />
      {
        players.map((item) => (
            <CustomPlayer id={item.id} name={item.name} score={item.score} key={item.id}
              isHighScore={isHighScore() === item.score}></CustomPlayer>
          )
        )
      }
      <AddPlayerForm></AddPlayerForm>
    </div>
  );
}

export default App;
