import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from './components/navbar'; // Ensure correct import

function ButtonControl() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("Token");

    if (!storedToken) {
      navigate("/");
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/data`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        console.log("API Response:", response.data);
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        navigate("/");
      });
  }, [navigate]);

  return (
    <div className="flex">
      <Navbar /> {/* Ensure Navbar is rendered */}
      <div className="flex-1 p-4">
        <div className="container mx-auto mt-8">
          <h1>Button Control</h1>
          <p>Control buttons and actions here.</p>
        </div>
      </div>
    </div>
  );
}

export default ButtonControl;
