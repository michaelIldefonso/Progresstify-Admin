import React from "react"
import Navbar from "./components/navbar"
import { DataTable, userSchema } from "./components/users-table"

// Mock user data
const mockUsers: z.infer<typeof userSchema>[] = [
  { id: "1", email: "user1@example.com", role: "User" },
  { id: "2", email: "admin@example.com", role: "Admin" },
  { id: "3", email: "user2@example.com", role: "Moderator" },
]

function Users() {
  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 p-4">
        <div className="container mx-auto mt-8">
          <h1 className="text-xl font-bold mb-4">Users</h1>
          <DataTable users={mockUsers} />
        </div>
      </div>
    </div>
  )
}

export default Users
