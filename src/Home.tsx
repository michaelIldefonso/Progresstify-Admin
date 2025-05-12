import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/navbar';
import { apiClient } from "@/utils/auth"; // Use centralized Axios instance

function Home() {
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

        const fetchData = async () => {
            const client = apiClient(navigate); // Initialize Axios instance with navigate
            try {
                const response = await client.get("/api/data");
                setUser({
                    name: response.data.userName,
                    role: response.data.userRole === 1 ? "Admin" : "User",
                    role_id: response.data.userRole,
                });
            } catch (error: unknown) { // Replace `any` with `unknown`
                if (
                    error instanceof Error &&
                    (error as { response?: { status: number } }).response?.status === 401 // Narrowing error type
                ) {
                    try {
                        await client.post("/api/refresh-token");
                        const retryResponse = await client.get("/api/data");
                        setUser({
                            name: retryResponse.data.userName,
                            role: retryResponse.data.userRole === 1 ? "Admin" : "User",
                            role_id: retryResponse.data.userRole,
                        });
                    } catch (refreshError) {
                        console.error("Error refreshing token:", refreshError);
                        navigate("/");
                    }
                } else {
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
                <div className="container mx-auto mt-8 bg-gray-800 p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
                    <p className="text-lg">
                        <span className="font-semibold">Role:</span> {user.role}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;
