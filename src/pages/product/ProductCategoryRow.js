import React from 'react';

export const ProductCategoryRow = (props) => {
  return (
    <tr colspan="2">
      <th>{props.category}</th>
    </tr>
  );
}