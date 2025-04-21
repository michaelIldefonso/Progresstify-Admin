import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div className="flex">
            <nav className="bg-gray-600 text-white h-screen p-4 w-48">
                <div className="flex flex-col items-start space-y-4">
                    <div className="text-lg font-bold mb-4">Progresstify</div>
                    <ul className="flex flex-col space-y-2">
                        <li><Link to="/home" className="hover:underline">Home</Link></li>
                        <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
                        <li><Link to="/userManagement" className="hover:underline">User Management</Link></li>
                        <li><Link to="/button-control" className="hover:underline">Button Control</Link></li>
                        <li><a href="#logout" className="hover:underline">Logout</a></li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
