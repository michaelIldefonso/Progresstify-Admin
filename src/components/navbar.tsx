import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove authentication tokens from localStorage
        localStorage.removeItem("Token"); // Ensure correct casing
        localStorage.removeItem("RefreshToken"); // Clear refresh token
        // Redirect user to login page
        navigate("/"); // Navigate to login
    };

    return (
        <div className="flex">
            <nav className="bg-gray-800 text-gray-300 h-screen p-4 w-48">
                <div className="flex flex-col items-start space-y-4">
                    <div className="text-lg font-bold text-white mb-4">Progresstify</div>
                    <ul className="flex flex-col space-y-2">
                        <li><Link to="/home" className="hover:underline hover:text-white">Home</Link></li>
                        <li><Link to="/dashboard" className="hover:underline hover:text-white">Dashboard</Link></li>
                        <li><Link to="/userManagement" className="hover:underline hover:text-white">User Management</Link></li>
                        <li><Link to="/settings" className="hover:underline hover:text-white">Settings</Link></li>
                        <li><button onClick={handleLogout} className="hover:underline hover:text-white text-left">Logout</button></li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
