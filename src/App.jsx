import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/adminDashboard";
import AdminUsers from "./components/adminUsers";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/users" element={<AdminUsers />} />
      </Routes>
    </Router>
  );
}

export default App;
