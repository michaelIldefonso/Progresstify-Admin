import React from 'react';
import Navbar from './components/Navbar'; // Ensure correct import

function DataManagement() {
    return (
        <div>
            <Navbar /> {/* Ensure Navbar is rendered */}
            <div className="container mx-auto mt-8">
                <h1>Data Management</h1>
                <p>Manage your data here.</p>
            </div>
        </div>
    );
}

export default DataManagement;
