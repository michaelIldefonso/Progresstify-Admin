import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from './components/navbar'; // Ensure correct import

function PageControl() {
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
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Navbar /> {/* Ensure Navbar is rendered */}
      <div className="flex-1 p-4">
        <div className="container mx-auto mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-xl font-bold mb-4">Button Control</h1>
          <p>Control buttons and actions here.</p>
        </div>
      </div>
    </div>
  );
}

export default PageControl;
