import React from 'react';
import { Box, Typography, Switch, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const PersonalizationSettings = () => {
    return (
        <Box mb={4}>
            <Typography variant="h5" gutterBottom>Personalization</Typography>
            <Box mt={2}>
                <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select defaultValue="English">
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Spanish">Spanish</MenuItem>
                        <MenuItem value="French">French</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box mt={2}>
                <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select defaultValue="USD">
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                        <MenuItem value="GBP">GBP</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box mt={2}>
                <Typography variant="body1">Theme</Typography>
                <Switch color="primary" /> Dark Mode
            </Box>
        </Box>
    );
};

export default PersonalizationSettings;
