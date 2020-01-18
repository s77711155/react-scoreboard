import React from 'react';
import './App.css';
import {Header} from "./components/Header";
import {Player} from "./components/Player";

// 규칙
// 1.React.Component를 상속 받아야함
// 2. 랜더 함수를 반드시 사용해야함-> 랜더 안에 리턴해야함

// 프랍스가 있으면 json 객체으로 만들어서 전달 한다 ///컴포넌
// 트를 호출하면서 속성을 첫번째 파라미터로 json객체로 만들어서 전달한다
class App extends React.Component{
    state ={
        players :[
            {name : 'LDk', id:1},
            {name : 'sdf', id:2},
            {name : 'awr', id:3},
            {name : '이정니', id:4},
            {name : '안녕', id:5}
        ]// 플레이어 지웟다 추가 할수 잇게 스테이트로 해쥼
    }
    handleRemovePlayer = (id) =>{
        console.log('handleRemove' ,id);
        // 해당되는 id를 삭제
        this.setState(prevState =>{
            const players = prevState.players.filter(item =>item.id !== id);
            // es6 short hand property : 키와 값이 같으면 한쪽 생략
            return {players : players}
        })
    }
    render() {
        return (
            <div className="scoreboard">
                <Header title='My ScoreBord' toltalPlayers={11}/>
                {/*key는 그냥 내부적으로 전달 컴포넌트끼리 전달은 안됨*/}
                {
                    this.state.players.map(item => {
                        return <Player removePlayer={this.handleRemovePlayer} id={item.id} name={item.name} key={item.id} />
                    })
                }
            </div>
        )
    }
}


export default App;
