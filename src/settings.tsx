import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/utils/auth"; // Replace axios with apiClient
import Navbar from './components/navbar'; // Ensure correct import
import { Switch } from "@/components/ui/switch";
import { refreshToken } from "@/utils/auth"; // Import shared utility

function PageControl() {
  const navigate = useNavigate();
  const client = apiClient(navigate); // Initialize API client
  const [user, setUser] = useState(null);

  // Maintenance settings state 
  const [loading, setLoading] = useState(true);
  const [maintenanceId] = useState("1"); // Replace with dynamic ID if needed

  useEffect(() => {
    const fetchData = async () => {
      let storedToken = localStorage.getItem("Token");

      if (!storedToken) {
        navigate("/");
        return;
      }

      try {
        const response = await client.get("/api/data");
        setUser(response.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          try {
            storedToken = await refreshToken(navigate); // Pass navigate to refreshToken
            const retryResponse = await client.get("/api/data");
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

    // Fetch maintenance settings from backend
    const fetchMaintenanceSettings = async () => {
      setLoading(true);
      try {
        const response = await client.get(`/api/admin/maintenance/${maintenanceId}`);
        const data = response.data;
        console.log("Fetched maintenance data:", data); // Debugging log
        setMaintenanceMode(data.is_enabled || false);
        console.log("Updated maintenanceMode state:", data.is_enabled || false); // Debugging log
        setMaintenanceEnd(new Date(data.estimated_end).toISOString().slice(0, 16)); // Format for datetime-local input
        setMaintenanceMessage(data.message || "We are currently performing maintenance. Please check back soon.");
      } catch (error) {
        console.error("Error fetching maintenance settings:", error);
        setMaintenanceMode(false);
        setMaintenanceEnd("");
        setMaintenanceMessage("We are currently performing maintenance. Please check back soon.");
      } finally {
        setLoading(false);
      }
    };
    fetchMaintenanceSettings();
  }, [navigate]);

  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceEnd, setMaintenanceEnd] = useState("");

  // New state for maintenance message
  const [maintenanceMessage, setMaintenanceMessage] = useState("We are currently performing maintenance. Please check back soon.");

  const handleToggle = async () => {
    const newMode = !maintenanceMode;
    setMaintenanceMode(newMode);

    if (newMode) {
      // Always set default value to current date and time when toggling on
      const now = new Date();
      const defaultValue = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setMaintenanceEnd(defaultValue);
    }

    if (!newMode) {
      // Call API immediately when toggled off
      try {
        await client.put(`/api/admin/maintenance/${maintenanceId}`, {
          is_enabled: false,
          message: null,
          estimated_end: null,
        });
        console.log("Maintenance mode turned off");
      } catch (error) {
        console.error("Error updating maintenance settings:", error);
      }
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Validate year to ensure it's 4 digits
    const year = parseInt(value.split("-")[0], 10);
    if (year <= 9999) {
      setMaintenanceEnd(value);
    }
  };

  const clearEndTime = () => {
    setMaintenanceEnd("");
  };

  useEffect(() => {
    if (!maintenanceEnd) {
      // Set default value to current date and time if empty
      const now = new Date();
      const defaultValue = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setMaintenanceEnd(defaultValue);
    }
  }, [maintenanceEnd]);

  // New handler for maintenance message
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaintenanceMessage(e.target.value);
  };

  // Save handler (stub, implement API call as needed)
  const handleSave = async () => {
    try {
      await client.put(`/api/admin/maintenance/${maintenanceId}`, {
        is_enabled: maintenanceMode,
        message: maintenanceMessage,
        estimated_end: maintenanceEnd,
      });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving maintenance settings:", error);
      alert("Failed to save settings.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex-1 p-4">
        <div className="container mx-auto mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-xl font-bold mb-4">Settings</h1>
          {loading ? (
            <div className="text-gray-300">Loading maintenance settings...</div>
          ) : (
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span>Maintenance Mode</span>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={handleToggle} // Use handleToggle for the Switch component
                  aria-label="Toggle maintenance mode"
                />
                <span className="ml-2">{maintenanceMode ? "On" : "Off"}</span>
              </div>
              <div className="mt-2 text-sm">
                <span>Status: </span>
                {maintenanceMode ? (
                  <span className="text-yellow-400 font-semibold">Maintenance is ON</span>
                ) : (
                  <span className="text-green-400 font-semibold">Site is LIVE</span>
                )}
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
                  <button
                    className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    onClick={clearEndTime}
                  >
                    Clear
                  </button>
                  {maintenanceEnd && (
                    <p className="mt-2 text-sm text-gray-300">
                      Maintenance scheduled to end at: {new Date(maintenanceEnd).toLocaleString()}
                    </p>
                  )}
                  {/* Maintenance message input */}
                  <label className="block mt-4 mb-2">Maintenance Message</label>
                  <input
                    type="text"
                    value={maintenanceMessage}
                    onChange={handleMessageChange}
                    className="bg-gray-700 text-white p-2 rounded w-full"
                    placeholder="Enter maintenance message..."
                  />
                  {/* Save button */}
                  <button
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageControl;