import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/navbar';
import axios from 'axios';

function Home() {
    const [user, setUser] = useState({ name: '', role: '', role_id: null });
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token is present in the URL and store it in localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token"); // Get token from URL

        if (token) {
            localStorage.setItem("Token", token); // Store token in localStorage
            window.history.replaceState({}, document.title, "/home"); // Remove token from URL
        }

        const storedToken = localStorage.getItem("Token"); // Get token from localStorage

        if (!storedToken) {
            // If no token is found, redirect to the login page
            console.error("No token found, redirecting...");
            navigate("/");
            return;
        }

        // Fetch user data from the API
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/api/data`, {
                headers: { Authorization: `Bearer ${storedToken}` },
            })
            .then((response) => {
                console.log("API Response:", response.data); // Debug log
                const userData = response.data;
                setUser({
                    name: userData.userName,
                    role: userData.userRole === 1 ? 'Admin' : 'User',
                    role_id: userData.userRole,
                });
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
                localStorage.removeItem("authToken"); // Clear invalid token
                navigate("/"); // Redirect to the login page
            });
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
