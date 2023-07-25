




import Login from "./pages/Login/Login"
import Owner from "./pages/Owner/Owner"
import Manager from "./pages/Manager/Manager"
import Seller from "./pages/Seller/Seller"
import Base from "./pages/Base/Base"
import { Routes, Route } from "react-router-dom";
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Base />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/owner" element={<Owner />}></Route>
      <Route path="/manager" element={<Manager />}></Route>
      <Route path="/seller" element={<Seller />}></Route> */
    </Routes>
  );
}

export default App;
