import { useEffect, useState } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://progresstify.onrender.com/api/users", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const changeRole = (userId, newRole) => {
    fetch(`https://progresstify.onrender.com/api/users/${userId}/role`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    })
      .then(() => setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user)))
      .catch(err => console.error("Error updating role:", err));
  };

  return (
    <div>
      <h2>Manage Users</h2>
      {users.map(user => (
        <div key={user.id}>
          <span>{user.name} ({user.email}) - {user.role}</span>
          <button onClick={() => changeRole(user.id, "admin")}>Make Admin</button>
          <button onClick={() => changeRole(user.id, "user")}>Make User</button>
        </div>
      ))}
    </div>
  );
};

export default AdminUsers;
