






import cors from 'cors';
import Person from './app/models/personSchema.js';
import Warehouse from "./app/models/warehouseSchema.js"
import Item from './app/models/itemSchema.js';
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app =express();
const port =  process.env.PORT || 3001;
app.use(express.json());



app.use(cors());

app.post('/login', async (req, res) => {
  try {
    const formData=req.body
    const person = await Person.findOne({ email: formData.email, password: formData.password });
    if (!person) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const output={
      type:person.type,
      name:person.name,
      email:person.email,
      id: person._id
    }
    res.status(200).json(output)
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/signup', async (req,res)=>{
  const formData=req.body
  const Val_result = await validator(formData)
  console.log(Val_result)
  if (Val_result.length==0){
    const newPerson = new Person({
      name: formData.name,
      CNIC: formData.CNIC,
      email: formData.email,
      password: formData.password,
      type: formData.type,
      phone: formData.phone,
      age: formData.age,
    })
    const output={
      type:newPerson.type,
      name:newPerson.name,
      email:newPerson.email,
      id:newPerson._id
    }
    newPerson.save()
      .then(()=>{
        console.log("I am about to save")
        res.status(200).json(output)
      })
      .catch((err)=>{
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
      })
  }
  else{
    console.log("I am rejecting you")
    res.status(401).json({ message: "Following were invalid fields {"+Val_result.join(", ")+"}"});
  }
})
app.get('/managers', async (req, res) => {
  try {
    const managers = await Person.find({
      type: 'Manager',
      _id: { $nin: await Warehouse.distinct('manager') }
    });

    if (managers.length > 0) {
      res.status(200).json(managers);
    } else {
      res.status(401).json({ message: 'No Managers Available' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/warehouses', async (req, res) => {
  try {
    const warehouses = await Warehouse.find()
      .populate('manager', 'CNIC name');
    const warehouseData = warehouses.map((w) => ({
      warehouse: w._id,
      location: w.location,
      managerName: w.manager.name,
      managerCNIC: w.manager.CNIC,
    }));

    res.status(200).json(warehouseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/warehouse', async (req, res) => {
  try {
    const { managerId, location } = req.body;
    const existingWarehouse = await Warehouse.findOne({ location: location });
    if (existingWarehouse) {
      res.status(400).json({ message: 'Warehouse location already exists' });
      return;
    }
    const existingManager = await Warehouse.findOne({ manager: managerId }).populate("manager");
    if (existingManager) {
      res.status(400).json({ message: 'Manager not availabe' });
      return;
    }
    const manager = await Person.findOne({ _id: managerId, type: 'Manager' });
    if (!manager) {
      res.status(400).json({ message: 'Manager not found' });
      return;
    }
    const warehouse = new Warehouse({
      manager: managerId,
      location: location
    });
    await warehouse.save();
    const warehouses = await Warehouse.find()
      .populate('manager', 'CNIC name');
    const warehouseData = warehouses.map((w) => ({
      warehouse: w._id,
      location: w.location,
      managerName: w.manager.name,
      managerCNIC: w.manager.CNIC,
    }));

    const managers = await Person.find({ type: 'Manager' }).select('_id');
    const assignedManagers = await Warehouse.find().distinct('manager');
    const unassignedManagers = managers.filter((m) => !assignedManagers.includes(m._id));

    res.status(200).json({ warehouseData, unassignedManagers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/sellers', async (req, res) => {
  try {
    const sellers = await Person.find({ type: 'Seller' });
    if (sellers.length === 0) {
      return res.status(404).json({ message: 'No sellers found' });
    }
    const sellerData = sellers.map((seller) => ({
      name: seller.name,
      CNIC: seller.CNIC,
      email: seller.email,
      phone: seller.phone,
    }));
    res.status(200).json(sellerData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post("/trustedseller", async (req, res) => {
  try {
    const sellerCNIC = req.body.sellerCNIC;
    const seller = await Person.findOne({ CNIC: sellerCNIC, type: "Seller" });
    if (!seller) {
      res.status(400).json({ message: "Person not found or not a seller" });
      return;
    }
    seller.type = "Trusted Seller";
    await seller.save();
    const Sellers = await Person.find({ type: "Seller" });
    res.status(200).json(Sellers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/item/:sellerId", async (req, res) => {
  try {
    const { itemName, price } = req.body;
    const { sellerId } = req.params;

    const item = new Item({
      seller: sellerId,
      name: itemName,
      price: price,
      warehouse: null,
      buyer: null,
      status: "UnBought"
    });
    await item.save();

    const unboughtItems = await Item.find({ seller: sellerId, status: "UnBought" })
      .populate("seller", "name");

    res.status(200).json({ items: unboughtItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/unboughtitems/:sellerId", async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const items = await Item.find({ seller: sellerId, status: "UnBought" })
      .populate("seller", "name");

    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/items/buy/:managerId", async (req, res) => {
  try {
    const { itemIds } = req.body;
    const { managerId } = req.params;
    const items = await Item.find({
      _id: { $in: itemIds },
      warehouse: null,
    });
    const warehouse = await Warehouse.findOne({ manager: managerId }).select('_id');
    items.forEach(item => {
      item.status = "Bought";
      item.price = 0;
      item.buyer = managerId;
      item.warehouse = warehouse._id;
    });
    await Promise.all(items.map(item => item.save()));
    const unboughtItems = await Item.find({
      status: "UnBought",
    }).populate("seller", "name");
    res.status(200).json({ items: unboughtItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/items/unbought", async (req, res) => {
  try {
    const unboughtItems = await Item.find({ status: "UnBought" }).populate("seller", "name");
    res.status(200).json({ items: unboughtItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const mongoString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ycxovuy.mongodb.net/`
mongoose.connect(mongoString, {useNewUrlParser: true})
  .then(() => console.log('Connected to MongoDB database.'))
  .catch((error) => console.log('Error connecting to MongoDB database:', error));

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
})

async function validator(i){
  let message=[]
  if(!await typeValidator(i.type))
  {
    console.log("Invalid Type")
    message.push("type")
  }
  if(!nameValidator(i.name))
  {
    console.log("Invalid Name")
    message.push("name")
  }
  if(!await emailValidator(i.email))
  {
    console.log("Invalid Email")
    message.push("email")
  }
  if(!passwordValidator(i.password,i.confirm_password))
  {
    console.log("Invalid Password")
    message.push("password")
  }
  if(!ageValidator(i.age))
  {
    console.log("Invalid Age")
    message.push("age")
  }
  if(!await CNICValidator(i.CNIC))
  {
    console.log("Invalid CNIC")
    message.push("CNIC")
  }
  if(!phoneValidator(i.phone))
  {
    console.log("Invalid Phone")
    message.push("phone")
  }
  return message
}


function nameValidator(name){
  const regex = /^[a-zA-Z]+$/;
  if(regex.test(name)){
    return true
  }
  return false
}
async function emailValidator(email){
  const person = await Person.findOne({ email: email });
  if(person){
    console.log("This Email Already exists : "+email)
    console.log(person.toJSON())
    return false
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(regex.test(email)){
    return true
  }
  return false
}
function passwordValidator(p1,p2){
  const regex = /\d/;
  if((p1===p2) && (p1.length>=16) && regex.test(p1)){
    return true
  }
  return false
}
function ageValidator(age){
  let value=age
  return (value>17);
}
async function CNICValidator(CNIC){
  const regex = /^\d{5}-\d{7}-\d{1}$/
  const person = await Person.findOne({ CNIC: CNIC });
  if(person){
    console.log("CNIC Already exists: " + CNIC)
    console.log(person.toJSON())
    return false
  }
  if(regex.test(CNIC)){
    return true
  }
  return false
}
function phoneValidator(phone){
  const regex = /^(?:\+92|0)?(?:\d{3}-\d{7}|\d{4}-\d{6}|\d{10})$/
  if(regex.test(phone)){
    return true
  }
  return false
}
async function typeValidator(type){
  if (type==="Owner"){
    const person = await Person.findOne({ type: type });
    if(person){
      console.log("Owner Already exists: ")
      console.log(person.toJSON())
      return false
    }
    return true
  }
  else{
    return true
  }
}
