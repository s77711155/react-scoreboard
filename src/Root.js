import React from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import {Home} from "./pages/home/Home";
import {Heroes} from "./pages/heroes/Heroes";
import {Scoreboard} from "./pages/scoreboard/Scoreboard";
import {FilterableProductTable} from "./pages/product/FilterableProductTable";
import {Menu} from "./Menu";

export const Root = (props) => {
  return (
    <BrowserRouter>
      <Menu></Menu>
      {/*라우팅정의: 유알엘에 따라서 컴포넌트 매핑을 정의*/}
      <div className="container" style={{backgroundColor: '#ffffff'}}>
        <Route path="/" exact component={Home}></Route>
        <Route path="/heroes" component={Heroes}></Route>
        <Route path="/scoreboard" component={Scoreboard}></Route>
        <Route path="/product" component={<FilterableProductTable></FilterableProductTable>}></Route>
      </div>
    </BrowserRouter>
  );
}