import React from "react";
import {changeScore} from "../redux/actions";
import {connect, useDispatch} from "react-redux";

function Counter(props) {
  const dispatch = useDispatch();
  return (
    <div className="counter">
      <button className="counter-action decrement"
              onClick={() => dispatch(changeScore(props.id, -1))}>-
      </button>
      <span className="counter-score">{props.score}</span>
      <button className="counter-action increment"
              onClick={() => dispatch(changeScore(props.id, 1))}>+
      </button>
    </div>
  );
}

export default Counter;