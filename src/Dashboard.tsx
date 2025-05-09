import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
import Navbar from "@/components/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { refreshToken } from "@/utils/auth"; // Import shared utility

export default function Page() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let storedToken = localStorage.getItem("Token");

      if (!storedToken) {
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/data`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          storedToken = await refreshToken();
          const retryResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/data`, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setUser(retryResponse.data);
        } else {
          console.error("Error fetching user data:", error);
          navigate("/");
        }
      }
    };

    fetchData();
  }, [navigate]);

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