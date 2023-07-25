






import mongoose from 'mongoose';
import Person from "./personSchema.js"


const warehouseSchema = new mongoose.Schema({
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person'
  },
  location: String,
  employee:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person'
  }]
});

const Warehouse =  mongoose.model('Warehouse', warehouseSchema);
export default Warehouse;
