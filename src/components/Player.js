import React from "react";
import Counter from "./Counter";
import {removePlayer} from "../redux/actions";
import {useDispatch} from "react-redux";

const Player = (props) => {
  const dispatch = useDispatch();
  return (
    <div className="player">
      <span className="player-name">
        <button className="remove-player" onClick={() => dispatch(removePlayer(props.id))}>x</button>
        {props.children}
        {props.name}
      </span>
      <Counter id={props.id} score={props.score}></Counter>
    </div>
  );
}

// HoC, 커링 펑션
export default Player;