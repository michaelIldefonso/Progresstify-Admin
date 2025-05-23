import * as React from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/utils/auth";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.enum(["Admin", "User", "Moderator"]),
  oauth_id: z.string().nullable(),
  oauth_provider: z.string().nullable(),
});

type User = z.infer<typeof userSchema>;

interface RawUser {
  id?: string;
  oauth_id?: string;
  email: string;
  role_name?: string;
  oauth_provider?: string;
}

export function DataTable() {
  const [data, setData] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sortByRole, setSortByRole] = React.useState<"asc" | "desc" | null>(null);
  const navigate = useNavigate();

  // Map role names to IDs for API usage
  const roleNameToIdMap = React.useMemo(
    () => ({
      admin: 1,
      moderator: 2,
      user: 3,
    }),
    []
  );

  type RoleKey = keyof typeof roleNameToIdMap;

  // Sort users by role if sorting is enabled
  const sortedData = React.useMemo(() => {
    if (!sortByRole) return data;
    return [...data].sort((a, b) => {
      const roleA = roleNameToIdMap[a.role.toLowerCase() as RoleKey] ?? Infinity;
      const roleB = roleNameToIdMap[b.role.toLowerCase() as RoleKey] ?? Infinity;
      return sortByRole === "asc" ? roleA - roleB : roleB - roleA;
    });
  }, [data, sortByRole, roleNameToIdMap]);

  // Fetch users from API and normalize data
  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    const client = apiClient(navigate);
    try {
      const response = await client.get("/api/admin/users");
      const usersWithRoles: User[] = response.data
        .map((user: RawUser) => {
          const id = user.oauth_id || user.id;
          const roleName = (user.role_name || "user").toLowerCase();
          if (!id || !(roleName in roleNameToIdMap)) return null;

          return {
            id,
            email: user.email,
            role: roleName.charAt(0).toUpperCase() + roleName.slice(1) as User["role"],
            oauth_id: user.oauth_id ?? null,
            oauth_provider: user.oauth_provider ?? null,
          };
        })
        .filter(Boolean) as User[];

      setData(usersWithRoles);
    } catch (error: unknown) {
      // If unauthorized, try to refresh token and retry
      if (isAxiosError(error) && error.response.status === 401) {
        try {
          await client.post("/api/refresh-token");
          await fetchUsers();
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          navigate("/");
        }
      } else {
        // On other errors, log and redirect
        console.error("Error fetching users:", error);
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, roleNameToIdMap]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Update a user's role via API
  const updateUserRole = async (id: string, newRole: User["role"]) => {
    const client = apiClient(navigate);
    const role_id = roleNameToIdMap[newRole.toLowerCase() as RoleKey];
    try {
      await client.put(`/api/admin/users/${id}/role`, { role_id });
      toast.success("User role updated!");
      await fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role.");
    }
  };

  // Delete a user via API after confirmation
  const deleteUser = async (id: string) => {
    const client = apiClient(navigate);
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await client.delete(`/api/admin/users/${id}`);
        toast.success("User deleted successfully!");
        await fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user.");
      }
    }
  };

  if (loading) {
    return (
      <div className="h-[500px] w-full">
        <Skeleton className="h-full w-full bg-gray-700" />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-100px)] rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">Provider</TableHead>
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
                <TableCell className="text-center">{user.oauth_provider || "N/A"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-center">{user.role}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Select
                      value={user.role}
                      onValueChange={(value) =>
                        updateUserRole(user.id, value as User["role"])
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Change role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">admin</SelectItem>
                        <SelectItem value="User">user</SelectItem>
                        <SelectItem value="Moderator">moderator</SelectItem>
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
              <TableCell colSpan={5} className="text-center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function isAxiosError(error: unknown): error is { response: { status: number } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { status?: number } }).response?.status === "number"
  );
}
