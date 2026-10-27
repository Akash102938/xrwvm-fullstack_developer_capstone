import LoginPanel from "./components/Login/Login";
import { Routes, Route } from "react-router-dom";
import Register from "./components/Register/Register";
import Dealers from './components/Dealers/Dealers';
import Dealer from "./components/Dealers/Dealer"; // Import the Dealer component

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dealers" element={<Dealers />} />
      <Route path="/dealer/:id" element={<Dealer />} /> {/* Add the route for individual dealer reviews */}
    </Routes>
  );
}

export default App;