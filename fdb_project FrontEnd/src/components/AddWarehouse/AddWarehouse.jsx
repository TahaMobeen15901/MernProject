import React from 'react'
import Input from '../Input/Input'
import "./AddWarehouse.scss"
export default function AddWarehouse(props) {
  return (
    <>
      {(props.managers.length >0) && <div className="warehouse-form-popup">
        <form className="warehouse-form" onSubmit={props.handler}>
          <Input type="text" placeholder="" label="Location" name="location" tpadding="30"></Input>
          <select name="managerId">
            {props.managers.map((manager, index)=>{
            return(
              <option key={index} value={manager._id} >{manager._id}&nbsp;&nbsp;&nbsp;{manager.name}</option>
            )})}
          </select>
          <div className='add-warehouse-buttons'>
            <button onClick={()=>{props.setaddW(false)}}>Cancel</button>
            <input type='submit' value="Create"></input>
          </div>
          {props.errmessage && <label className="add-warehouse-error">{props.errmessage}</label>}
        </form>
      </div>}
    </>
  )
}

