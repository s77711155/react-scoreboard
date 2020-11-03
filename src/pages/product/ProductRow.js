import React from 'react';
import './ProdctRow.css';
import className from 'classnames';

export const ProductRow = (props) => {
  return (
    <tr>
      <td className={className({'stock': !props.stocked})}>{props.name}</td>
      <td>{props.price}</td>
    </tr>
  );
}