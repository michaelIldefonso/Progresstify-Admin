import React from 'react';
import Navbar from './components/Navbar'; // Ensure correct import

function ButtonControl() {
    return (
        <div>
            <Navbar /> {/* Ensure Navbar is rendered */}
            <div className="container mx-auto mt-8">
                <h1>Button Control</h1>
                <p>Control buttons and actions here.</p>
            </div>
        </div>
    );
}

export default ButtonControl;
