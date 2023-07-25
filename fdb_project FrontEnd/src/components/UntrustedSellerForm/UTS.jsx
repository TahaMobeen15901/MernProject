import React from 'react'





export default function UTS(props) {
  return (
    <form onSubmit={props.handleAddTS}>
      <select name="sellerCNIC">
        {props.untrusted_sellers.map((untrusted_seller, index)=>{
          return (
            <option key={index} value={untrusted_seller.CNIC} >
              {untrusted_seller.CNIC}
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              {untrusted_seller.name}
            </option>)})}
      </select>
      <input type="submit" value="Authorize Him"></input>
      {props.errmessage && <label className="add-warehouse-error">{props.errmessage}</label>}
    </form>
  )
}

