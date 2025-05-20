import React from "react";
import Navbar from "./components/navbar";
import { DataTable } from "./components/users-table";
import { apiClient } from "./utils/auth"; // Adjusted import to use the correct path
import { useNavigate } from "react-router-dom";

function isAxiosError(error: unknown): error is { response: { status: number } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { status?: number } }).response?.status === "number"
  );
}

function Users() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      const client = apiClient(navigate); // Initialize Axios instance with navigate
      try {
        await client.get("/api/admin/users"); // Use relative path
      } catch (error: unknown) {
        if (isAxiosError(error) && error.response.status === 403) {
          alert("Access denied. Admins only.");
          navigate("/home");
        } else if (isAxiosError(error) && error.response.status === 401) {
          try {
            await client.post("/api/refresh-token"); // Use relative path
            await client.get("/api/admin/users"); // Use relative path
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

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex-1 p-4">
        <div className="container mx-auto mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-xl font-bold mb-4">Users</h1>
          <DataTable />
        </div>
      </div>
    </div>
  );
}

export default Users;
