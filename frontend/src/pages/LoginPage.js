import React from 'react';
import { Box, Typography, Paper, useMediaQuery, useTheme } from '@mui/material';
import Login from '../components/Login';

const LoginPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundImage: 'url(https://your-image-url.com)', // Replace with your image URL
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: isMobile ? 2 : 0, // Add padding for mobile
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: isMobile ? 3 : 4, // Adjust padding based on screen size
                    maxWidth: isMobile ? '90%' : 400, // Adjust width for mobile
                    width: '100%',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Typography variant={isMobile ? 'h5' : 'h4'} component="h1" gutterBottom>
                    Financial Manager
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Manage your finances with ease
                </Typography>
                <Login />
            </Paper>
        </Box>
    );
};

export default LoginPage;
