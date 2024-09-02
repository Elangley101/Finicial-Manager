import React from 'react';
import Sidebar from './Sidebar';
import { Box, Container } from '@mui/material';
import DataManagementSettings from './DataManagementSettings';
import AccessibilitySettings from './AccessibilitySettings';
import PersonalizationSettings from './PersonalizationSettings'; // Ensure this is the correct path
import LinkPlaid from './LinkPlaid'; // Import the LinkPlaid component

const Settings = () => {
    const handlePlaidSuccess = (public_token, metadata) => {
        // Handle the successful connection, typically by sending the public_token to your backend
        console.log('Plaid public_token:', public_token);
        console.log('Plaid metadata:', metadata);
    };

    return (
        <Box display="flex">
            <Sidebar />
            <Box flexGrow={1} p={3}>
                <Container maxWidth="md">
                    <DataManagementSettings />

                    <AccessibilitySettings />
                    {/* Include the LinkPlaid component for bank connection */}
                    <Box mt={4}>
                        <h3>Bank Connection</h3>
                        <LinkPlaid onSuccess={handlePlaidSuccess} />
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Settings;
