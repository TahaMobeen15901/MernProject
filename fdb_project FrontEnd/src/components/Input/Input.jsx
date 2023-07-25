



import React from "react";

import "./Input.scss";

const Input = ({ type, placeholder, name, label, tpadding }) => {
  const styles={
    padding: "5px "+tpadding+"px"
  }
  return (
    <div className="input-main">
      <label htmlFor={name} className="form-inputLabel">{label}</label>
      <input type={type} className="form-input" placeholder={placeholder} name={name} style={styles}/>
    </div>
    );
};

export default Input;
