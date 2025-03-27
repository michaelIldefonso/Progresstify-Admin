import React from 'react';
import { Link } from 'react-router-dom';

function Homepage() {
    return (
        <div>
            {/* Navbar */}
            <nav className="bg-blue-600 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="text-lg font-bold">Progresstify</div>
                    <ul className="flex space-x-4">
                        <li><Link to="/" className="hover:underline">Home</Link></li>
                        <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
                        <li><Link to="/data-management" className="hover:underline">Data Management</Link></li>
                        <li><Link to="/users" className="hover:underline">Users</Link></li>
                        <li><Link to="/button-control" className="hover:underline">Button Control</Link></li>
                        <li><a href="#logout" className="hover:underline">Logout</a></li>
                    </ul>
                </div>
            </nav>
            <div className="container mx-auto mt-8">
                <h1>Welcome to Progresstify</h1>
                <p>Your one-stop solution for progress tracking and management.</p>
            </div>
        </div>
    );
}

export default Homepage;
