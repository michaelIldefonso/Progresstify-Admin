import React from "react";

function Admin() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-2xl">120</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold">Active Projects</h2>
          <p className="text-2xl">15</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold">Completed Tasks</h2>
          <p className="text-2xl">320</p>
        </div>
      </div>
    </div>
  );
}

export default Admin;