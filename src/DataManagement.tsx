import React from 'react';
import Navbar from './components/navbar'; // Ensure correct import

function DataManagement() {
    return (
        <div className="flex">
            <Navbar /> {/* Ensure Navbar is rendered */}
            <div className="flex-1 p-4">
                <div className="container mx-auto mt-8">
                    <h1>Data Management</h1>
                    <p>Manage your data here.</p>
                </div>
            </div>
        </div>
    );
}

export default DataManagement;
