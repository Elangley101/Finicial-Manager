import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

const LandingPageContainer = () => {
    return (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Welcome to Financial Manager
            </Typography>
            <Typography variant="body1" gutterBottom>
                Please login or register to continue
            </Typography>
            <Box sx={{ mt: 4 }}>
                <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    color="primary"
                    sx={{ mr: 2 }}
                >
                    Login
                </Button>
                <Button
                    component={Link}
                    to="/signup"
                    variant="outlined"
                    color="primary"
                >
                    Register
                </Button>
            </Box>
        </Box>
    );
};

export default LandingPageContainer;
