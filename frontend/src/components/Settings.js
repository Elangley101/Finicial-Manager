import React from 'react';
import Sidebar from './Sidebar';
import { Box, Container } from '@mui/material';
import DataManagementSettings from './DataManagementSettings';
import PersonalizationSettings from './PersonalizationSettings';
import AccessibilitySettings from './AccessibilitySettings';

const Settings = () => {
    return (
        <Box display="flex">
            <Sidebar />
            <Box flexGrow={1} p={3}>
                <Container maxWidth="md">
                    <DataManagementSettings />
                    <PersonalizationSettings />
                    <AccessibilitySettings />
                </Container>
            </Box>
        </Box>
    );
};

export default Settings;
