import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const storedToken = localStorage.getItem("token"); // Adjust this based on how you store tokens
  const navigate = useNavigate();

  useEffect(() => {
    if (!storedToken) {
      console.error("Token is missing");
      navigate("/");
      return;
    }

    // Fetch users from the API
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/data`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${storedToken}` }
    })
    .then(response => {
      console.log("API Response:", response.data); // Debugging log
      // Assuming response.data is an array of user objects
      setUsers(response.data);
    })
    .catch(error => {
      console.error("There was an error fetching the users!", error);
      navigate("/");
    });
  }, [storedToken, navigate]);

  const handleSuspend = (id) => {
    // Implement suspend user logic here
    console.log(`Suspend user with id: ${id}`);
    // Example: axios.post(`/api/users/${id}/suspend`, {}, { headers: { Authorization: `Bearer ${storedToken}` } })
  };

  const handleDelete = (id) => {
    // Implement delete user logic here
    console.log(`Delete user with id: ${id}`);
    // Example: axios.delete(`/api/users/${id}`, { headers: { Authorization: `Bearer ${storedToken}` } })
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <button className="mb-4 px-4 py-2 bg-primary text-white rounded">
        Add User
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
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
              <tr key={user.userId}>
                <td className="px-4 py-2 border">{user.userId}</td>
                <td className="px-4 py-2 border">{user.userName}</td>
                <td className="px-4 py-2 border">{user.userEmail}</td>
                <td className="px-4 py-2 border">{user.userOauth_id}</td>
                <td className="px-4 py-2 border">
                  <button className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded" onClick={() => handleSuspend(user.userId)}>
                    Suspend
                  </button>
                  <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleDelete(user.userId)}>
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