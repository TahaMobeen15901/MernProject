







import personFormValidator from '../../components/PersonFormValidation';
import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import "./Login.scss"
import SignInPopup from '../SignInPopup/SignInPopup.jsx';
import Input from "../../components/Input/Input.jsx"
export default function Login() {
  let navigate=useNavigate()
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');
  function handleLinkCLick(){
    setShowPopup(true)
    setError("")
  }
  function handleSubmit(event){
    const formData = new FormData(event.target)
    personFormValidator(event,formData,setError,"login",navigate)
  }
  return(
    <div className='Login-Page'>
      {showPopup && <SignInPopup Alive={showPopup} onCancel={()=>setShowPopup(false)}/>}
      <div className="Heading">
        <div className="Logo">
          <span className="Logo-NEXUS">
            NEXUS&nbsp;
          </span>
          <span className="Logo-GOODS">
            GOODS
          </span>
        </div>
        <div className="Heading-Subtitle">
          Connecting you to quality products.
        </div>
      </div>
      <form className='Login-Form' onSubmit={handleSubmit}>
        <Input type="text" placeholder="" name="email" label='Email' tpadding='50'></Input>
        <Input type="password" placeholder="" name="password" label='Password' tpadding='50'></Input>
        <div className="Associates">
          <div className="Sign-In-Link" onClick={handleLinkCLick}>
            Sign up Here
          </div>
          <div className="ForgPass">Forgot Password?</div>
        </div>
        {error && <div className='Error'>{error}</div>}
        <input  type="submit" className="FSB" value="Login"></input>
      </form>
    </div>
  )
}
