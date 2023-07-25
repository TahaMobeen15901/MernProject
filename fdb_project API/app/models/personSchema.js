

import mongoose from 'mongoose';



const personSchema = new mongoose.Schema({
  name: String,
  CNIC: String,
  email: String,
  password: String,
  type: String,
  phone: String,
  age: Number,
  gender: {type: String, enum: ["M", "F"]}
});

const Person =  mongoose.model('Person', personSchema);
export default Person;
