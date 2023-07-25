





import "./Seller.scss"
import axios from "axios"
import React, {useState} from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Input from "../../components/Input/Input";
import Table from "../../components/Table/Table";
import { useLocation} from 'react-router-dom';

export default function Seller() {
  const location = useLocation();
  const[displayAI,setDisplayAI]=useState(false)
  const[displayVI,setDisplayVI]=useState(false)
  const[items,setItems]=useState([])
  const [errmessage,seterrmessage]=useState("")
  const [loaded,setLoaded]=useState(false)
  function AI(){setDisplayVI(false);setDisplayAI(true)}
  function VI(){setDisplayVI(true);setDisplayAI(false)}
  const data = location.state;
  const valid_type=(data.type==="Trusted Seller" )? true : false
  function handleAI(event){
    event.preventDefault()
    const formData=new FormData(event.target)
    let itemName = formData.get("itemName");
    let price = formData.get("price");
    axios.post("http://localhost:8000/item/"+data.id,{itemName, price})
      .then(response=>{
        setItems(response.data.items)
        seterrmessage("");
        VI()
        setLoaded(true)
      })
      .catch(error=>{
        seterrmessage(error.response.data.message)
        setLoaded(true)
      })
  }
  const main_entry=()=>{
    if(displayAI){
      return(
        <form onSubmit={handleAI} className="SellerName">
          <label className="AIFT">ADD ITEM</label>
          <Input type="text" placeholder="" label="Item name" name="itemName" tpadding="50"></Input>
          <Input type="number" placeholder="" label="Price" name="price" tpadding="50"></Input>
          <input type="submit" value="Create Item" className="AIFSB"></input>
        </form>
      )
    }
    else if(displayVI){
      if(!loaded){
        axios.get("http://localhost:8000/unboughtitems/"+data.id)
          .then(response=>{
            setItems(response.data)
            seterrmessage("");
            setLoaded(true)
          })
          .catch(error=>{
            seterrmessage(error.response.data.message);
            setLoaded(true)
          })
      }
      let display=items.map(item=>{
        return [item._id,item.name]
      })
      console.log(display)
      return (
        <Table
          headings={["Item ID","Item Name"]}
          entries={display}
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
        {name: "Add Items", handler:AI},
        {name:"View Items", handler:VI}]}>
      </Navbar>
      <div className="main">{ main_entry()}</div>
    </div>}
    {!valid_type && <h1>You are Not to be Trusted</h1>}
    {errmessage && <label style={{color:"red"}}>{errmessage}</label>}
    </>
  )

}

