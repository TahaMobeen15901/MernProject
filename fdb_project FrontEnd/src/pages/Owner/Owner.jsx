






import formValidator from "../../components/FormValidation";
import axios from "axios"
import React,{useState} from "react"
import Navbar from "../../components/Navbar/Navbar"
import Table from "../../components/Table/Table";
import Input from "../../components/Input/Input";
import "./Owner.scss"
export default function Owner(props) {
  const [displayW,setdisplayW]=useState(false)
  const [displayTS,setdisplayTS]=useState(false)
  const [addW,setaddW]=useState(false)
  const [warehouses,setwarehouses]=useState([])
  const [errmessage,seterrmessage]=useState("")
  const[managers,setManagers]=useState([])
  const[untrusted_sellers,setUntrustedSellers]=useState([])


  function W(){
    console.log("I am about to get warehouses")
    axios.get('http://localhost:8000/warehouses')
      .then(response => {
        console.log(response.data)
        const whs=response.data.map(wh=>{
          return Object.values(wh)
        })
        console.log(whs)
        if(whs.length===0){
          console.log("No warehouses found")
        }
        setwarehouses(whs)
      })
      .catch(error => {
        console.log(error.response.data.message)
        seterrmessage(error.response.data.message)
      });
      console.log("I am about to get available managers")
      axios.get("http://localhost:8000/managers")
        .then(response => {
          setManagers(response.data)
          seterrmessage("")
        })
        .catch(error => {
          seterrmessage(error.response.data.message)
        })
    setdisplayW(true)
    setdisplayTS(false)

  }
  function TS(){
    console.log("I am in TS")
    axios.get("http://localhost:8000/sellers")
      .then(response =>{
        console.log("Untrusted Sellers List Updated")
        console.log(response.data)
        setUntrustedSellers(response.data)
      })
      .catch(error =>{
        console.log("Untrusted Sellers List Updated")
        setUntrustedSellers([])
        console.log(error.response.data.message)
        seterrmessage(error.response.data.message)
      })
    setdisplayW(false)
    setdisplayTS(true)
  }
  function handleAddW(){
    setaddW(true)
  }
  function handleAddWSubmission(event){
    function t(response,navigate){
      console.log(response.data)
      let {whs,mgrs}=response.data
      whs=whs.map(wh=>{
        return Object.values(wh)
      })
      if(whs.length===0){
          console.log("No warehouses found")
      }
      console.log(mgrs)
      setwarehouses(whs)
      setManagers(mgrs)
      setaddW(false)
    }
    function c(inp){
      seterrmessage(inp)
    }
    const formData = new FormData(event.target)
    formValidator(event,formData,t,c,"warehouse",undefined)
  }
  function handleAddTS(event){
    function t(response,navigate){
      console.log("Untrusted Sellers found")
      TS()
    }
    function c(inp){
      seterrmessage(inp)
    }
    const formData = new FormData(event.target)
    formValidator(event,formData,t,c,"trustedseller",TS)

  }
  const main_entry=()=>{

    if(displayW){
      let wform=null
      if(addW)
      {
        wform=
        <>
          {(managers.length >0) && <div className="warehouse-form-popup">
            <form className="warehouse-form" onSubmit={handleAddWSubmission}>
              <Input type="text" placeholder="" label="Location" name="location" tpadding="30"></Input>
              <select name="managerId">
                {managers.map((manager, index)=>{
                return(
                    <option key={index} value={manager._id} >{manager._id}&nbsp;&nbsp;&nbsp;{manager.name}</option>
                )
              })}
              </select>
              <div className='add-warehouse-buttons'>
                <button onClick={()=>{setaddW(false)}}>Cancel</button>
                <input type='submit' value="Create"></input>
              </div>
              {errmessage && <label className="add-warehouse-error">{errmessage}</label>}
            </form>
          </div>}
        </>
      }

      return (
        <>
          <Table
            headings={["Warehouse ID","Warehouse Location","Manager Name","Manager CNIC"]}
            entries={warehouses}
            addable={true}
            handleAdd={handleAddW}
            hoverable={false}>
          </Table>
          {wform}
        </>
      )
    }
    else if(displayTS){
      return (
        <>
          {
            (untrusted_sellers.length > 0) &&
            <form onSubmit={handleAddTS}>
              <select name="sellerCNIC">
                {untrusted_sellers.map((untrusted_seller, index)=>{
                  return (<option key={index} value={untrusted_seller.CNIC} >
                    {untrusted_seller.CNIC}
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    {untrusted_seller.name}
                  </option>)
                })}
              </select>
              <input type="submit" value="Authorize Him"></input>
              {errmessage && <label className="add-warehouse-error">{errmessage}</label>}
            </form>
          }
        </>
      )
    }
    else{
      return <></>
    }
  }
  return(
    <div className="Owner-Page">
      <Navbar navlinks={[
        {name: "Warehouses", handler:W},
        {name:"Trusted Sellers",handler:TS}]}>
      </Navbar>
      <div className="main">
        { main_entry()}
      </div>
    </div>
  )
}
