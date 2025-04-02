import * as React from "react"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

// Define schema for user data
export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.enum(["Admin", "User", "Moderator"]),
})

type User = z.infer<typeof userSchema>

export function DataTable({ users }: { users: User[] }) {
  const [data, setData] = React.useState(users)

  const updateUserRole = (id: string, newRole: User["role"]) => {
    setData((prevData) =>
      prevData.map((user) =>
        user.id === id ? { ...user, role: newRole } : user
      )
    )
    toast.success("User role updated!")
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead className="text-center">Current Role</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length ? (
            data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Select
                      value={user.role}
                      onValueChange={(value) => updateUserRole(user.id, value as User["role"])}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Change role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Moderator">Moderator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
