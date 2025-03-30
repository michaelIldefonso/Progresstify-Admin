import React from 'react';
import Navbar from './components/Navbar'; // Import Navbar

function Home() {
    return (
        <div className="flex">
            <Navbar /> {/* Use Navbar component */}
            <div className="flex-1 p-4">
                <div className="container mx-auto mt-8">
                    <h1>Welcome NAME</h1>
                    <p>Power: ADMIN</p>
                    <p></p>

                </div>
            </div>
        </div>
    );
}

export default Home;
