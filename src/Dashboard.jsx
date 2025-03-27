import React from 'react';
import Navbar from './components/Navbar'; // Ensure correct import

function Dashboard() {
    return (
        <div>
            <Navbar /> {/* Ensure Navbar is rendered */}
            <div className="container mx-auto mt-8">
                <h1>Dashboard</h1>
                <p>Welcome to the Dashboard page.</p>
            </div>
        </div>
    );
}

export default Dashboard;
