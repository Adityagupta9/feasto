import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './components/Login'
import FoodDashboard from "./components/FoodDashboard";
import CreateItem from "./components/CreateItem";
import FoodOpen from "./components/FoodOpen";
import Cart from "./components/Cart";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<FoodDashboard/>}/>
        <Route path="/Cart" element={<Cart/>}/>
        <Route path="/food/:id" element={<FoodOpen />} />
        <Route path="/create-item" element={<CreateItem/>}/>
      </Routes>
    </Router>
  );
}

export default App;
