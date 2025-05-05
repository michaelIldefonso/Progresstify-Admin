import * as React from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import axios from "axios";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react"; // Add this import
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

// Define schema for user data
export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.enum(["Admin", "User", "Moderator"]),
  oauth_id: z.string().nullable(), // Add oauth_id
  oauth_provider: z.string().nullable(), // Add oauth_provider
});

type User = z.infer<typeof userSchema>;

export function DataTable() {
  const [data, setData] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true); // Add loading state
  const [sortByRole, setSortByRole] = React.useState<"asc" | "desc" | null>(null); // State for sorting
  const navigate = useNavigate();

  const roleNameToIdMap: Record<string, number> = {
    admin: 1,
    moderator: 2,
    user: 3,
  };

  const sortedData = React.useMemo(() => {
    if (!sortByRole) return data;
    return [...data].sort((a, b) => {
      const roleA = roleNameToIdMap[a.role.toLowerCase()] ?? Infinity;
      const roleB = roleNameToIdMap[b.role.toLowerCase()] ?? Infinity;
      return sortByRole === "asc" ? roleA - roleB : roleB - roleA;
    });
  }, [data, sortByRole]);

  React.useEffect(() => {
    const fetchData = async () => {
      const storedToken = localStorage.getItem("Token");

      if (!storedToken) {
        navigate("/");
        setLoading(false); // Ensure loading is set to false if no token
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/users`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        console.log("API Response:", response.data); // Debugging log
        const usersWithRoles = response.data.map((user: any) => ({
          id: user.oauth_id || user.id, // Use oauth_id if available
          email: user.email,
          role: user.role_name || "unknown",
          oauth_id: user.oauth_id, // Include oauth_id
          oauth_provider: user.oauth_provider, // Include oauth_provider
        }));
        setData(usersWithRoles);
      } catch (error) {
        console.error("Error fetching users:", error);
        navigate("/");
      } finally {
        setLoading(false); // Ensure loading is set to false in all cases
      }
    };

    fetchData();
  }, [navigate]);

  const updateUserRole = (id: string, newRole: User["role"]) => {
    const storedToken = localStorage.getItem("Token");
    const role_id = roleNameToIdMap[newRole.toLowerCase()]; // Map role name to role_id

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

  const deleteUser = (id: string) => {
    const storedToken = localStorage.getItem("Token");

    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then(() => {
          setData((prevData) => prevData.filter((user) => user.id !== id));
          toast.success("User deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          toast.error("Failed to delete user.");
        });
    }
  };

  if (loading) {
    return (
      <div className="h-[500px] w-full">
        <Skeleton className="h-full w-full" /> {/* Show Skeleton while loading */}
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-100px)] rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">Provider</TableHead> {/* Center Provider column */}
            <TableHead className="text-center">Email</TableHead>
            <TableHead
              className="text-center cursor-pointer"
              onClick={() =>
                setSortByRole((prev) =>
                  prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
                )
              }
            >
              <div className="flex items-center justify-center gap-1">
                Current Role
                {sortByRole === "asc" && <ChevronUpIcon className="h-3 w-3" />}
                {sortByRole === "desc" && <ChevronDownIcon className="h-3 w-3" />}
                {sortByRole === null && (
                  <div className="flex flex-col items-center">
                    <ChevronUpIcon className="h-3 w-3" />
                    <ChevronDownIcon className="h-3 w-3" />
                  </div>
                )}
              </div>
            </TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length ? (
            sortedData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell className="text-center">{user.oauth_provider || "N/A"}</TableCell> {/* Move provider display here */}
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Select
                      value={user.role}
                      onValueChange={(value) => updateUserRole(user.id, value as User["role"])}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Change role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin" className="text-center">admin</SelectItem>
                        <SelectItem value="user" className="text-center">user</SelectItem>
                        <SelectItem value="moderator" className="text-center">moderator</SelectItem>
                      </SelectContent>
                    </Select>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center"> {/* Adjust colspan */}
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
