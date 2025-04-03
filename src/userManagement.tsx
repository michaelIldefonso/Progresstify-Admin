import React from "react";
import Navbar from "./components/navbar";
import { DataTable } from "./components/users-table";

function Users() {
  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 p-4">
        <div className="container mx-auto mt-8">
          <h1 className="text-xl font-bold mb-4">Users</h1>
          <DataTable />
        </div>
      </div>
    </div>
  );
}

export default Users;
