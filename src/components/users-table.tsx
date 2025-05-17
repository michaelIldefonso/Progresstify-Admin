import * as React from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { apiClient } from "@/utils/auth"; // Use centralized Axios instance
import { z } from "zod";
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

  const roleNameToIdMap = React.useMemo(() => {
    return {
      admin: 1,
      moderator: 2,
      user: 3,
    } as const;
  }, []);

  type RoleKey = keyof typeof roleNameToIdMap;

  const sortedData = React.useMemo(() => {
    if (!sortByRole) return data;
    return [...data].sort((a, b) => {
      const roleA = roleNameToIdMap[(a.role.toLowerCase() as RoleKey)] ?? Infinity;
      const roleB = roleNameToIdMap[(b.role.toLowerCase() as RoleKey)] ?? Infinity;
      return sortByRole === "asc" ? roleA - roleB : roleB - roleA;
    });
  }, [data, sortByRole, roleNameToIdMap]);

  interface RawUser {
  id?: string;
  oauth_id?: string;
  email: string;
  role_name?: string;
  oauth_provider?: string;
}

  // Extract fetch logic so it can be reused
  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    const client = apiClient(navigate);
    try {
      const response = await client.get("/api/admin/users");
      const usersWithRoles = response.data.map((user: RawUser) => ({
        id: user.oauth_id || user.id,
        email: user.email,
        role: user.role_name || "unknown",
        oauth_id: user.oauth_id,
        oauth_provider: user.oauth_provider,
      }));
      setData(usersWithRoles);
    } catch (error) {
      // error is unknown, but may be AxiosError
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as { response?: { status?: number } }).response?.status === 401
      ) {
        try {
          await client.post("/api/refresh-token");
          const retryResponse = await client.get("/api/admin/users");
          const usersWithRoles = retryResponse.data.map((user: RawUser) => ({
            id: user.oauth_id || user.id,
            email: user.email,
            role: user.role_name || "unknown",
            oauth_id: user.oauth_id,
            oauth_provider: user.oauth_provider,
          }));
          setData(usersWithRoles);
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          navigate("/");
        }
      } else {
        console.error("Error fetching users:", error);
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRole = async (id: string, newRole: User["role"]) => {
    const client = apiClient(navigate);
    const role_id = roleNameToIdMap[newRole.toLowerCase() as RoleKey];
    try {
      await client.put(`/api/admin/users/${id}/role`, { role_id });
      toast.success("User role updated!");
      await fetchUsers(); // Reload users after update
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role.");
    }
  };

  const deleteUser = async (id: string) => {
    const client = apiClient(navigate);
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await client.delete(`/api/admin/users/${id}`);
        toast.success("User deleted successfully!");
        await fetchUsers(); // Reload users after delete
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user.");
      }
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
                  {user.role}
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
