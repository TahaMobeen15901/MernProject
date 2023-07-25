


import personFormValidator from '../../components/PersonFormValidation';
import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import './SignInPopup.scss';
import Input from "../../components/Input/Input.jsx"
export default function SignInPopup(props) {
  let navigate=useNavigate()
  const [error2, setError2] = useState("");
  function Cancel(){
    props.onCancel()
  }
  function handleSubmit(event){
    const formData = new FormData(event.target)
    personFormValidator(event,formData,setError2,"signup",navigate)
  }
  return (
    <form className="popup-container" onSubmit={handleSubmit}>
      <div className='popup-con2'>
        <div className="popupC popupC1">
          <Input type="text" placeholder="" name="name" label='Name' tpadding='30'></Input>
          <Input type="text" placeholder="" name="CNIC" label='CNIC' tpadding='50'></Input>
          <Input type="text" placeholder="" name="email" label='Email' tpadding='50'></Input>
          <Input type="password" placeholder="" name="password" label='Password' tpadding='50'></Input>
          <Input type="password" placeholder="" name="confirm_password" label='Confirm-Password' tpadding='50'></Input>
          <label htmlFor='type'>Select your role?</label>
          <select name="type">
            <option value="Owner">Owner</option>
            <option value="Seller">Seller</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
        <div className='popupC2'>
          <div className="popupC">
            <Input type="text" placeholder="" name="phone" label="Phone" tpadding="50"></Input>
            <Input type="number" placeholder="" name="age" label="Age" tpadding="20"></Input>
            <label htmlFor='gender'>Gender</label>
            <select name="gender">
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div className='popup-buttons'>
            <button onClick={Cancel}>Cancel</button>
            <input type='submit' value="Create"></input>
          </div>
          {error2 && <div className='Error2'>{error2}</div>}
        </div>
      </div>
    </form>
  )}
