import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://progresstify.onrender.com/api/user", {
      credentials: "include", // ✅ Include session cookies
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.role !== "admin") {
          window.location.href = "https://progresstify.vercel.app/"; // 🚀 Redirect non-admins
        } else {
          setUser(data);
        }
      })
      .catch(() => window.location.href = "https://progresstify.vercel.app/") // If error, redirect
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, Admin {user?.name}!</h1>
      {/* Add Admin Features Here */}
    </div>
  );
};

export default AdminDashboard;
