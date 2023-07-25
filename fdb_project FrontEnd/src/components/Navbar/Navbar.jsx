






import React from 'react'
import Navlink from "../Navlink/Navlink"
import "./Navbar.scss"
export default function Navbar(props) {
  const Navlinks = props.navlinks.map((navlink, index)=>{
    return (<Navlink key={index} name={navlink.name} handler={navlink.handler}></Navlink>)
  })
  return (
    <div className="navbar">
        <div className="inner-nav">
          <div className="heading">
            <div className="title">NEXUS</div>
            <div className="subtitle">Connecting you to quality goods</div>
          </div>
          <div className="links">
            {Navlinks}
          </div>
        </div>
      </div>
  )
}
