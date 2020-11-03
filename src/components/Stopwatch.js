import React from 'react';

export class Stopwatch extends React.Component {
  tickRef;
  state = {
    isRunning: false,
    timer: 0
  }

  // Dom 이 렌더링 된 직후에 호출.
  // Rest API 호출, 3rd 라이브러리 로딩
  componentDidMount() {
    this.tickRef = setInterval(() => {
      if (this.state.isRunning) {
        this.setState(prevState => {
          return {
            timer: prevState.timer + 1
          }
        })
      }
    }, 1000);
  }
  // DOM이 파괴되기 직전에 호출
  // 리소스 해제 등
  componentWillUnmount() {
    clearInterval(this.tickRef);
  }

  handleStopwatch = () => {
    this.setState(prevState => {
      return {
        isRunning: !prevState.isRunning
      }
    })
  }

  render() {
    return (
      <div className="stopwatch">
        <h2>Stopwatch</h2>
        <span className="stopwatch-time">{this.state.timer}</span>
        <button onClick={this.handleStopwatch}>
          {
            this.state.isRunning ? 'Stop' : 'Start'
          }
        </button>

        <button onClick={() => this.setState({timer: 0})}>Reset</button>
      </div>
    );
  }
}
