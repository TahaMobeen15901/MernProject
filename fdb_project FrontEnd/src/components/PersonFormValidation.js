import formValidator from "./FormValidation";







export default function personFormValidator(event,formData,c,link,navigate){
  function t(response,navigate){
    const { type, name, email, id } = response.data;
    let ty=null
    if(type==="Seller" || type==="Trusted Seller"){
      ty="seller"
    }
    else{
      console.log(ty)
      ty=type[0].toLowerCase()+type.slice(1)

    }
    navigate('/'+ty,{state:{type:type, name:name, email:email, id:id}})
  }
  formValidator(event,formData,t,c,link,navigate)
}
