import React from "react";

export class Counter extends React.Component{  // React.Component 상속 받아서 부모의 속성도 물려받음
    // 방법 1
    // state ={
    //     score:30
    // }
    // 방법 2
    constructor() {
        super(); // 부모의 속성 가져오기
        this.state ={
            score:30
        }
        //this.handScore = this.handScore.bind(this)
    }

    // 화살표 함수는 메소드가 아니라 속성으로 되서, 굳이 바인드 안해두 됨
    // 비동기로 실핼될때 this가 큐에 들어가서 의미(부모)를 못찾게 된다???? settimeour이나 ajax 군데 화살표함수로 하면 찾음음
    handScore = (delta) =>{
        //this.setState({score:this.state.score+1})
        this.setState(prevState =>{
            return{score:prevState.score + delta}
        })
        console.log(this);
    }

    render() {
        return(
            <div className='counter'>
                <button className="counter-action decrement" onClick={()=>this.handScore(-1)}>-</button>
                <span className='counter-score'>{this.state.score}</span>
                <button className="counter-action increment" onClick={() =>this.handScore(1)}>+</button>
                {/*// 함수가 오ㅑ아함 함수 호출결과가 오는게 아니라 this.increment()하믄 클릭하기도 전에 랜더링만 되도 결과 호출*/}
            </div>
        );
    }
}