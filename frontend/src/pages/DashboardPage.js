import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard'; // Import the Dashboard component

const DashboardPage = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Dashboard />
            </Box>
        </Box>
    );
};

export default DashboardPage;
