




import "./Manager.scss"
import axios from "axios"
import React,{useState} from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { useLocation} from 'react-router-dom';
export default function Manager() {
  const location = useLocation();
  const data = location.state;
  const [Buyer,setBuyer]=useState(false)
  const [errmessage,seterrmessage]=useState("")
  const [unbought_items,setUnboughtItems]=useState([])
  const [loaded,setLoaded]=useState(false)
  function B(){setBuyer(true)}
  function handleItemSubmit(event){
    event.preventDefault()
    const formData=new FormData(event.target)
    let itemIds = formData.get("itemIds");
    console.log(itemIds)
    axios.post("http://localhost:8000/items/buy/"+data.id, {itemIds})
    .then(response =>{
      setUnboughtItems(response.data.items)
      seterrmessage("");
      setLoaded(true)
    })
    .catch(error =>{
      seterrmessage(error.response.data.message)
      setLoaded(true)
    })
  }
  const main_entry=()=>{
    if(!loaded){
      axios.get("http://localhost:8000/items/unbought")
      .then(response=>{
        setUnboughtItems(response.data.items)
        seterrmessage("");
        setLoaded(true)
      })
      .catch(error => {
        seterrmessage(error.response.data.message)
        setLoaded(true)
      })
    }
    if(Buyer){
      return (
        <form onSubmit={handleItemSubmit} className="Manager-Form">
          <label className="MFL">Select Items You Want</label>
          <select name="itemIds" multiple={true} className="Manager-Select">
            {unbought_items.map((item,index)=>{
              return <option key={index} value={item._id} >
                {item._id}
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                {item.name}
              </option>
            })}
          </select>
          <input type="submit" value="Buy Items"></input>
          {errmessage && <label style={{color:"red"}}>{errmessage}</label>}
        </form>
      )
    }
    else{return <></>}
  }
  return (
    <div className="Manager-Page">
      <Navbar navlinks={[{name: "Buy Items", handler:B}]}></Navbar>
      <div className="main">{ main_entry()}</div>
    </div>
  )
}
