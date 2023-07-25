




import axios from 'axios';

export default function formValidator(event,formData,t,c,link,...functions){
  event.preventDefault()
    const data = {};
    for (let key of formData.keys()) {
      data[key] = formData.get(key);
    }
    let invalid_fields=[]
    for(const [key, value] of formData.entries()){
      if(value.length===0){
        invalid_fields.push(key)
      }
    }
    if (invalid_fields.length ===0){
      axios.post('http://localhost:8000/'+link, data)
      .then(response => {
        t(response,...functions)
      })
      .catch(error => {
        c(error.response.data.message);
      });
    }
    else{
      const errorString= "Please enter the following fields {"+invalid_fields.join(', ')+"}"
      c(errorString)
    }
}
