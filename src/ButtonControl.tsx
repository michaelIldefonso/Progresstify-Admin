import React from 'react';
import Navbar from './components/navbar'; // Ensure correct import

function ButtonControl() {
    return (
        <div className="flex">
            <Navbar /> {/* Ensure Navbar is rendered */}
            <div className="flex-1 p-4">
                <div className="container mx-auto mt-8">
                    <h1>Button Control</h1>
                    <p>Control buttons and actions here.</p>
                </div>
            </div>
        </div>
    );
}

export default ButtonControl;
