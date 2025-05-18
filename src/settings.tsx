import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from './components/navbar'; // Ensure correct import
import { Switch } from "@/components/ui/switch";
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
      } catch (error: any) {
        if (error.response?.status === 401) {
          try {
            storedToken = await refreshToken(navigate); // Pass navigate to refreshToken
            const retryResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/data`, {
              withCredentials: true,
              headers: { Authorization: `Bearer ${storedToken}` },
            });
            setUser(retryResponse.data);
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            navigate("/");
          }
        } else {
          console.error("Error fetching user data:", error);
          navigate("/");
        }
      }
    };

    fetchData();
  }, [navigate]);

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceEnd, setMaintenanceEnd] = useState("");

  const handleToggle = () => {
    setMaintenanceMode((prev) => !prev);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaintenanceEnd(e.target.value);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex-1 p-4">
        <div className="container mx-auto mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-xl font-bold mb-4">Settings</h1>
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span>Maintenance Mode</span>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
                aria-label="Toggle maintenance mode"
              />
              <span className="ml-2">{maintenanceMode ? "On" : "Off"}</span>
            </div>
            {maintenanceMode && (
              <div className="mt-4">
                <label className="block mb-2">Maintenance End Time</label>
                <input
                  type="datetime-local"
                  value={maintenanceEnd}
                  onChange={handleEndTimeChange}
                  className="bg-gray-700 text-white p-2 rounded w-full"
                />
                {maintenanceEnd && (
                  <p className="mt-2 text-sm text-gray-300">
                    Maintenance scheduled to end at: {new Date(maintenanceEnd).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageControl;