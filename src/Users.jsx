import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const storedToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!storedToken) {
      console.error("Token is missing");
      navigate("/");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/data`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        navigate("/");
      });
  }, [storedToken, navigate]);

  const handleSuspend = (id) => {
    console.log(`Suspend user with id: ${id}`);
    // Add suspend logic here
  };

  const handleDelete = (id) => {
    console.log(`Delete user with id: ${id}`);
    // Add delete logic here
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Add User
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">OAuth ID</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{user.userId}</td>
                <td className="px-4 py-2 border">{user.userName}</td>
                <td className="px-4 py-2 border">{user.userEmail}</td>
                <td className="px-4 py-2 border">{user.userOauth_id}</td>
                <td className="px-4 py-2 border">
                  <button
                    className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    onClick={() => handleSuspend(user.userId)}
                  >
                    Suspend
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(user.userId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;