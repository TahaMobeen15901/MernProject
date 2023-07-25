





import React from 'react'
import "./Navlink.scss";
export default function Navlink(props) {
  return (
    <button onClick={props.handler} className='Navlink-buttons'>{props.name}</button>
  )
}
