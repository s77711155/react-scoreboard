import {CHANGE_SCORE, REMOVE_PLAYER} from "../actionTypes";

let maxId = 4;

const playerInitialState = {
  players: [
    { name: 'LDK', score: 5, id: 1},
    { name: 'HONG', score: 6, id: 2},
    { name: 'KIM', score: 7, id: 3},
    { name: 'PARK', score: 8, id: 4}
  ]
}

export const playerReducer = (state = playerInitialState, action) => {
  let players = null;
  switch (action.type) {
    case 'ADD_PLAYER':
      players = [ ...state.players ];
      players.push({id: ++maxId, name: action.name, score: 0});
      return {
        ...state,
        players
      }
    case CHANGE_SCORE:
      players = [ ...state.players ];
      players.forEach(item => {
        if (item.id === action.id) {
          item.score += action.delta;
        }
      })
      return {
        ...state,
        players
      }
    case REMOVE_PLAYER:
      players = state.players.filter(item => item.id !== action.id);
      return {
        ...state,
        players
      }

    default:
      return state;
  }
}