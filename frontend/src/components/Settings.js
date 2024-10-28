import React, { useContext } from 'react';
import Sidebar from './Sidebar';
import { Box, Container, Typography, Paper } from '@mui/material';
import DataManagementSettings from './DataManagementSettings';
import AccessibilitySettings from './AccessibilitySettings';
import PersonalizationSettings from './PersonalizationSettings';
import LinkPlaid from './LinkPlaid';
import { LanguageContext } from '../context/LanguageContext';
import { ThemeContext } from '../context/ThemeProviderComponent';

const Settings = () => {
    const { language, setLanguage } = useContext(LanguageContext);
    const { toggleTheme } = useContext(ThemeContext);

    const handlePlaidSuccess = (public_token, metadata) => {
        console.log('Plaid public_token:', public_token);
        console.log('Plaid metadata:', metadata);
        // Handle successful Plaid connection here
    };

    return (
        <Box display="flex">
            <Sidebar />
            <Box flexGrow={1} p={3}>
                <Container maxWidth="md">
                    <Typography variant="h4" gutterBottom>
                        Settings
                    </Typography>
                    <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                        <Typography variant="h6" gutterBottom>
                            Data Management
                        </Typography>
                        <DataManagementSettings />
                    </Paper>
                    <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                        <Typography variant="h6" gutterBottom>
                            Accessibility
                        </Typography>
                        <AccessibilitySettings />
                    </Paper>
                    <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                        <Typography variant="h6" gutterBottom>
                            Personalization
                        </Typography>
                        <PersonalizationSettings />
                    </Paper>
                    <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                        <Typography variant="h6" gutterBottom>
                            Bank Connection
                        </Typography>
                        <LinkPlaid onSuccess={handlePlaidSuccess} />
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default Settings;
