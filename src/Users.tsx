import React from 'react';
import Navbar from './components/navbar'; // Import Navbar

function Users() {
    return (
        <div className="flex">
            <Navbar /> {/* Use Navbar component */}
            <div className="flex-1 p-4">
                <div className="container mx-auto mt-8">
                    <h1>Users</h1>
                    <p>Manage users here.</p>
                </div>
            </div>
        </div>
    );
}

export default Users;
