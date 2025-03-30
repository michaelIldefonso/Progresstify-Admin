import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login'; // Import Login page
import Home from './Home';
// import Dashboard from './Dashboard';
import DataManagement from './DataManagement';
import Users from './Users';
import ButtonControl from './ButtonControl';

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} /> {/* Ensure Login is the default page */}
                <Route path="/home" element={<Home />} />
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                <Route path="/data-management" element={<DataManagement />} />
                <Route path="/users" element={<Users />} />
                <Route path="/button-control" element={<ButtonControl />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
