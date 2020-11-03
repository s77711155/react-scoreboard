import React from 'react';
import _ from 'lodash';
import {ProductCategoryRow} from "./ProductCategoryRow";
import {ProductRow} from "./ProductRow";

export const ProductTable = (props) => {
  const category = _.groupBy(props.products, 'category');
  console.log(category);
  const categoryList = []; // 8개의 React Element를 저장
  for (let key in category) {
    // 1개의 category 컴포넌트
    categoryList.push(<ProductCategoryRow category={key} key={key}/>);
    // n개의 row 컴포넌트
    category[key].forEach(item => {
      categoryList.push(<ProductRow name={item.name} price={item.price} stocked={item.stocked}></ProductRow>);
    })
  }

  return (
    <table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Price</th>
      </tr>
      </thead>
      <tbody>
      {
        categoryList
      }
      </tbody>
    </table>
  );
}