import React from "react";

export const Header = (prpos) =>{
    // jsx문법으로 사용하면 바벨이 자동으로 creatElemnet 문법으로 변환해줌
    console.log(prpos);
    return (
        <header className="header">
            <h1 className="h1">{prpos.title}</h1>
            <span className="state">Player: {prpos.toltalPlayers}</span>
        </header>
    )  // reactElement를 리턴해줘야함 , 한문장이여서 return 명령어 생략 가눙
};