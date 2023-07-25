






import React, {useEffect } from 'react';
import {useNavigate} from 'react-router-dom'

export default function Base() {
  let navigate=useNavigate()
  useEffect(()=>{
    navigate('/login')
  })
  return(<>This is Base Page</>)
}
