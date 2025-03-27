import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage';
import Dashboard from './Dashboard';
import DataManagement from './DataManagement';
import Users from './Users';
import ButtonControl from './ButtonControl';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/data-management" element={<DataManagement />} />
                <Route path="/users" element={<Users />} />
                <Route path="/button-control" element={<ButtonControl />} />
            </Routes>
        </Router>
    );
}

export default App;
