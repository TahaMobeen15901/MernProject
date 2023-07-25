





import AuthorizeSeller from "../../components/AuthorizeSeller/AuthorizeSeller";
import formValidator from "../../components/FormValidation";
import axios from "axios"
import React,{useState, useEffect, useRef} from "react"
import Navbar from "../../components/Navbar/Navbar"
import Table from "../../components/Table/Table";
import AddWarehouse from "../../components/AddWarehouse/AddWarehouse";
import "./OwnerNew.scss"


export default function OwnerNew(props) {
  const [display,setDisplay]=useState(0)
  let warehousesRef=useRef([])
  let errmessageRef=useRef("")
  let managersRef=useRef([])
  let untrusted_sellersRef=useRef([])
  useEffect(()=>{
    if(display===1){
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
          warehousesRef.current=whs
        })
        .catch(error => {
          console.log(error.response.data.message)
          errmessageRef.current=(error.response.data.message)
      });
      console.log("I am about to get available managers")
      axios.get("http://localhost:8000/managers")
        .then(response => {
          managersRef.current=(response.data)
          errmessageRef.current=("")
        })
        .catch(error => {
          errmessageRef.current=(error.response.data.message)
        })
    }
    else if(display===2){
      console.log("I am in TS")
      axios.get("http://localhost:8000/sellers")
        .then(response =>{
          console.log("Untrusted Sellers List Updated")
          console.log(response.data)
          untrusted_sellersRef.current=(response.data)
        })
        .catch(error =>{
          console.log("Untrusted Sellers List Updated")
          untrusted_sellersRef.current=([])
          console.log(error.response.data.message)
          errmessageRef.current=(error.response.data.message)
        })
    }
    else{}
  },[display])
  function handleAddWSubmission(event){
    function t(response,f1){
      f1(1)
    }
    function c(inp){
      errmessageRef.current=inp
    }
    const formData = new FormData(event.target)
    formValidator(event,formData,t,c,"warehouse",setDisplay)
  }
  function handleAddTS(event){
    function t(response,f1){
      console.log("Untrusted Sellers found")
      f1(2)
    }
    function c(inp){
      errmessageRef.current=(inp)
    }
    const formData = new FormData(event.target)
    formValidator(event,formData,t,c,"trustedseller",setDisplay)

  }
  const main_entry=()=>{

    if(display===1){
      return (
        <>
          <Table
            headings={["Warehouse ID","Warehouse Location","Manager Name","Manager CNIC"]}
            entries={warehousesRef.current}
            addable={true}
            handleAdd={()=>{setDisplay(3)}}
            hoverable={false}>
          </Table>
        </>
      )
    }
    else if(display===2){
      return (
        <AuthorizeSeller
          handler={handleAddTS}
          errmessage={errmessageRef.current}
          untrusted_sellers={untrusted_sellersRef.current}>
        </AuthorizeSeller>
      )
    }
    else if(display===3){
      <AddWarehouse
        managers={managersRef.current}
        handler={handleAddWSubmission}
        errmessage={errmessageRef.current}>
      </AddWarehouse>
    }
    else{
      return <></>
    }
  }
  return(
    <div className="Owner-Page">
      <Navbar navlinks={[
        {name: "Warehouses", handler:()=>{setDisplay(1)}},
        {name:"Trusted Sellers",handler:(setDisplay(2))}]}>
      </Navbar>
      <div className="main">
        { main_entry()}
      </div>
    </div>
  )
}
