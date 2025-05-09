import React from "react";
import Navbar from "./components/navbar";
import { DataTable } from "./components/users-table";

function Users() {
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
