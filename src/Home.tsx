import React, { useEffect, useState } from 'react';
import Navbar from './components/navbar'; // Import Navbar

function Home() {
    const [user, setUser] = useState({ name: '', role: '', role_id: null });

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Simulate decoding the token or fetching user data from an API
            const userData = {
                name: 'John Doe', // Replace with actual decoded data
                role_id: 1, // Replace with actual decoded data
            };
            setUser({
                name: userData.name,
                role: userData.role_id === 1 ? 'Admin' : 'User',
                role_id: userData.role_id,
            });
        } else {
            // Redirect to login if no token is found
            window.location.href = '/login';
        }
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Navbar /> {/* Use Navbar component */}
            <div className="flex-1 p-6">
                <div className="container mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
                    <p className="text-lg">
                        <span className="font-semibold">Role:</span> {user.role}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Role ID:</span> {user.role_id}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Home;
