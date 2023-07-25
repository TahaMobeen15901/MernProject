




import mongoose from 'mongoose';
import Person from "./personSchema.js"
import Warehouse from "./warehouseSchema.js"


const itemSchema = new mongoose.Schema({
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse'
  },
  seller:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person'
  },
  buyer:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person'
  },
  name: String,
  status: {type: String, enum: ["Bought", "UnBought"]},
  price: Number,
});


const Item =  mongoose.model('Item', itemSchema);
export default Item;
