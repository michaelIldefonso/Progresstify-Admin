import * as React from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import axios from "axios";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

// Define schema for user data
export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.enum(["Admin", "User", "Moderator"]),
});

type User = z.infer<typeof userSchema>;

export function DataTable() {
  const [data, setData] = React.useState<User[]>([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const storedToken = localStorage.getItem("Token");

    if (!storedToken) {
      navigate("/");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        console.log("API Response:", response.data); // Debugging log
        const usersWithRoles = response.data.map((user: any) => ({
          ...user,
          role: user.role_name || "Unknown", // Map role_name to role
        }));
        setData(usersWithRoles);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        navigate("/");
      });
  }, [navigate]);

  const roleNameToIdMap: Record<string, string> = {
    admin: "1",
    moderator: "2",
    user: "3",

  };

  const updateUserRole = (id: string, newRole: User["role"]) => {
    const storedToken = localStorage.getItem("Token");
    const role_id = roleNameToIdMap[newRole]; // Map role name to role_id

    axios
      .put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${id}/role`,
        { role_id }, // Send role_id instead of role name
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      )
      .then(() => {
        setData((prevData) =>
          prevData.map((user) =>
            user.id === id ? { ...user, role: newRole } : user
          )
        );
        toast.success("User role updated!");
      })
      .catch((error) => {
        console.error("Error updating user role:", error);
        toast.error("Failed to update user role.");
      });
  };

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-100px)] rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-center">Current Role</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length ? (
            data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{user.role}</Badge> {/* Display the role */}
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
                        <SelectItem value="admin">admin</SelectItem>
                        <SelectItem value="user">user</SelectItem>
                        <SelectItem value="moderator">moderator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
