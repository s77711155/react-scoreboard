import React from 'react';
import _ from 'lodash';

export const Stats = (props) => {
  let totalPlayers = 0;
  let totalScore = 0;
  // 로직 구현
  totalPlayers = props.players.length;
  // props.players.forEach(player => {
  //   totalScore += player.score;
  // });
  totalScore = _.sumBy(props.players, 'score');

  return (
    <table className="stats">
      <tbody>
      <tr>
        <td>Players:</td>
        <td>{totalPlayers}</td>
      </tr>
      <tr>
        <td>Total score:</td>
        <td>{totalScore}</td>
      </tr>
      </tbody>
    </table>
  );
}