import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from './components/navbar'; // Ensure correct import
import { refreshToken } from "@/utils/auth"; // Import shared utility

function PageControl() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let storedToken = localStorage.getItem("Token");

      if (!storedToken) {
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/data`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          storedToken = await refreshToken();
          const retryResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/data`, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setUser(retryResponse.data);
        } else {
          console.error("Error fetching user data:", error);
          navigate("/");
        }
      }
    };

    fetchData();
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
