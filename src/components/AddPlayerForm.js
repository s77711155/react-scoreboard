import React from 'react';
import {addPlayer} from "../redux/actions";
import {connect} from "react-redux";

class AddPlayerForm extends React.Component {
  state = {
    value: ''
  }

  handleValueChange = (e) => {
    console.log('handleValueChange:', e);
    this.setState({value: e.target.value})
  }

  handleSubmit = (e) => {
    // form이 다른페이지로 이동하는 기본이벤트 막기
    e.preventDefault();

    const form = document.getElementById("form");
    const player = document.getElementById("player");

    console.log(player.validity.valid);
    console.log(form.checkValidity());

    if (!form.checkValidity()) {
      // 에러문구 노출
      return;
    }

    this.props.addPlayer(this.state.value);
    this.setState({value: ''});
  }

  render() {
    return (
      <form id="form" className="form" onSubmit={this.handleSubmit} noValidate>
        <input id="player" type="text" className="input" value={this.state.value} onChange={this.handleValueChange}
               placeholder="enter a player's name" required/>
        <input type="submit" className="input" value="Add Player"/>
      </form>
    );
  }
}

const mapActionToProps = (dispatch) => ({
  // 왼쪽은 props, 오른쪽은 (액션을 디스패치하는)펑션
  addPlayer: (name) => dispatch(addPlayer(name))
})

// HoC, 커링 펑션
export default connect(null, mapActionToProps)(AddPlayerForm);