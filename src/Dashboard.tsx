import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/utils/auth"; // Use centralized Axios instance
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import Navbar from "@/components/navbar";
import { Skeleton } from "@/components/ui/skeleton";

// Main dashboard page component
export default function Page() {
  const navigate = useNavigate(); // React Router navigation hook
  const [user, setUser] = useState(null); // State to store user data

  useEffect(() => {
    // Fetch user data on component mount
    const fetchData = async () => {
      const client = apiClient(navigate); // Initialize Axios instance with navigate
      try {
        // Attempt to fetch user data
        const response = await client.get("/api/data");
        setUser(response.data);
      } catch (err) {
        // Handle errors, including token expiration
        const error = err as unknown; // Replace `any` with `unknown`
        if (
          error instanceof Error &&
          (error as { response?: { status: number } }).response?.status === 401 // Narrowing error type
        ) {
          // If unauthorized, try to refresh token
          try {
            const refreshResponse = await client.post("/api/refresh-token");
            if (refreshResponse.status === 200) {
              // Retry fetching user data after refreshing token
              const retryResponse = await client.get("/api/data");
              setUser(retryResponse.data);
            } else {
              // If refresh fails, redirect to login
              navigate("/");
            }
          } catch (refreshError) {
            // Handle refresh token errors
            console.error("Error refreshing token:", refreshError);
            navigate("/");
          }
        } else {
          // Handle other errors
          console.error("Error fetching user data:", error);
          navigate("/");
        }
      }
    };

    fetchData();
  }, [navigate]);

  // Show loading skeletons while user data is being fetched
  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex flex-1 flex-col">
          <div className="p-4">
            <Skeleton className="h-8 w-1/4 mb-4 bg-gray-700" />
            <Skeleton className="h-48 w-full mb-4 bg-gray-700" />
            <Skeleton className="h-48 w-full bg-gray-700" />
          </div>
        </div>
      </div>
    );
  }

  // Render dashboard content when user data is available
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}