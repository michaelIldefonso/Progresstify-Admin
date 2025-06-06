import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/navbar';
import { apiClient } from "@/utils/auth"; // Use centralized Axios instance
import { Skeleton } from "@/components/ui/skeleton";

function Home() {
    // User state: name, role, and role_id
    const [user, setUser] = useState({ name: '', role: '', role_id: null });
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token and refreshToken are present in the URL and store them in localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const refreshToken = urlParams.get("refreshToken");

        if (token && refreshToken) {
            localStorage.setItem("Token", token);
            localStorage.setItem("RefreshToken", refreshToken);
            window.history.replaceState({}, document.title, "/home"); // Remove tokens from URL
        }

        const storedToken = localStorage.getItem("Token");

        if (!storedToken) {
            console.error("No token found, redirecting...");
            navigate("/");
            return;
        }

        // Fetch user data and handle authentication
        const fetchData = async () => {
            const client = apiClient(navigate); // Initialize Axios instance with navigate
            try {
                const response = await client.get("/api/data");
                setUser({
                    name: response.data.userName,
                    role: response.data.userRole === 1 ? "Admin" : response.data.userRole === 2 ? "Moderator" : "User",
                    role_id: response.data.userRole,
                });
            } catch (error: unknown) { // Replace `any` with `unknown`
                // Handle 401 (unauthorized) error and try to refresh token
                if (
                    error instanceof Error &&
                    (error as { response?: { status: number } }).response?.status === 401 // Narrowing error type
                ) {
                    try {
                        await client.post("/api/refresh-token");
                        const retryResponse = await client.get("/api/data");
                        setUser({
                            name: retryResponse.data.userName,
                            role: retryResponse.data.userRole === 1 ? "Admin" : retryResponse.data.userRole === 2 ? "Moderator" : "User",
                            role_id: retryResponse.data.userRole,
                        });
                    } catch (refreshError) {
                        console.error("Error refreshing token:", refreshError);
                        navigate("/");
                    }
                } else {
                    // Handle all other errors
                    console.error("Error fetching user data:", error);
                    navigate("/");
                }
            }
        };

        fetchData();
    }, [navigate]);

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <Navbar />
            <div className="flex-1 p-6">
                {user.name ? (
                    <div className="container mx-auto mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
                        <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
                        <p className="text-lg">
                            <span className="font-semibold">Role:</span> {user.role}
                        </p>
                    </div>
                ) : (
                    // Show skeleton loader while loading user data
                    <Skeleton className="h-32 w-full bg-gray-700" />
                )}
            </div>
        </div>
    );
}

export default Home;
