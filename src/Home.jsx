import React from 'react';
import Navbar from './components/Navbar'; // Import Navbar

function Home() {
    return (
        <div>
            <Navbar /> {/* Use Navbar component */}
            <div className="container mx-auto mt-8">
                <h1>Welcome to Progresstify</h1>
                <p>Your one-stop solution for progress tracking and management.</p>
            </div>
        </div>
    );
}

export default Home;
