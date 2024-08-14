import React from 'react';
import { Box, Typography, Paper } from '@mui/material'; // Import necessary MUI components
import Sidebar from '../components/Sidebar'; // Adjust the import path based on your file structure
import PasswordReset from '../components/PasswordReset';
import PersonalInformation from '../components/PersonalInformation';
import AccountSettings from '../components/AccountSettings';

const UserProfile = () => {
    return (
        <Box display="flex">
            <Sidebar />
            <Box flexGrow={1} p={3} className="user-profile">
                <Typography variant="h4" gutterBottom>User Profile</Typography>
                
                <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                    <PersonalInformation />
                </Paper>

                <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                    <AccountSettings />
                </Paper>

                <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                    <PasswordReset />
                </Paper>
            </Box>
        </Box>
    );
};

export default UserProfile;
