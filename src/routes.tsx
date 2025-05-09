import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login'; // Import Login page
import Home from './Home';
import Dashboard from './Dashboard';
import Users from './userManagement';
import PageControl from './PageControl';

function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} /> {/* Ensure Login is the default page */}
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/userManagement" element={<Users />} />
                <Route path="/pageControl" element={<PageControl />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
