// Table.jsx

import React from 'react';
import './Table.scss';

export default function Table(props) {
  const isHoverable=props.hoverable
  return (
    <table>
      <thead>
        <tr>
          {props.headings.map((heading, index) => {
            return <th key={index} className='heading'>{heading}</th>;
          })}
          {props.addable && <th>
            <button onClick={props.handleAdd}>+</button>
          </th>}
        </tr>
      </thead>
      <tbody>
        {Array.isArray(props.entries) && props.entries.map((entry, index) => {
          return (
            <tr
            className='inner-row'
            key={index}
            style={{'--bright':isHoverable}}>
              {entry.map((field, i) => {
                return <td key={i}>{field}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
