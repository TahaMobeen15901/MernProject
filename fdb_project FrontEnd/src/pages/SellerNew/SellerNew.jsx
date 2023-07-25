





import "./SellerNew.scss"
import axios from "axios"
import formValidator from "../../components/FormValidation"
import React, {useState, useEffect, useRef } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Input from "../../components/Input/Input";
import Table from "../../components/Table/Table";
import { useLocation} from 'react-router-dom';

export default function SellerNew() {
  const location = useLocation();
  const[display,setDisplay]=useState(0)
  let itemsRef=useRef([])
  let errmessageRef=useRef("")
  const data = location.state;
  const valid_type=(data.type==="Trusted Seller" )? true : false

  useEffect(()=>{
    if(valid_type && display===2){
      axios.get("http://localhost:8000/unboughtitems/"+data.id)
        .then(response=>{
          itemsRef.current=(response.data)
          errmessageRef.current=""
        })
        .catch(error=>{
          errmessageRef.current=(error.response.data.message)
        })
    }
  },[valid_type, display, data.id])



  function handleAI(event){

    const formData=new FormData(event.target)
      function t(response,f1){
        itemsRef.current=(response.data.items)
        errmessageRef.current=""
        f1(2)
      }
      function c(error){
        errmessageRef.current=error.response.data.message
      }
      formValidator(event,formData,t,c,"/item/"+data.id,setDisplay)
  }
  const main_entry=()=>{
    if(display===1){
      return(
        <form onSubmit={handleAI} className="SellerName">
          <label className="AIFT">ADD ITEM</label>
          <Input type="text" placeholder="" label="Item name" name="itemName" tpadding="50"></Input>
          <Input type="number" placeholder="" label="Price" name="price" tpadding="50"></Input>
          <input type="submit" value="Create Item" className="AIFSB"></input>
        </form>
      )
    }
    else if(display===2){
      let view=itemsRef.current.map(item=>{
        return [item._id,item.name]
      })
      console.log(view)
      return (
        <Table
          headings={["Item ID","Item Name"]}
          entries={view}
          addable={false}
          handleAdd={()=>{}}
          hoverable={false}
        >
        </Table>
        )
    }
    else{
      return <></>
    }
  }
  return (
   <>
   {valid_type &&
      <div className="Manager-Page">
      <Navbar navlinks={[
        {name: "Add Items", handler:()=>{setDisplay(1)}},
        {name:"View Items", handler:()=>{setDisplay(2)}}]}>
      </Navbar>
      <div className="main">{ main_entry()}</div>
    </div>}
    {!valid_type && <h1>You are Not to be Trusted</h1>}
    {errmessageRef.current && <label style={{color:"red"}}>{errmessageRef.current}</label>}
    </>
  )

}

