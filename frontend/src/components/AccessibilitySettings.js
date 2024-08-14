import React from 'react';
import { Box, Typography, Switch, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const AccessibilitySettings = () => {
    return (
        <Box mb={4}>
            <Typography variant="h5" gutterBottom>Accessibility</Typography>
            <Box mt={2}>
                <Typography variant="body1">Font Size</Typography>
                <FormControl fullWidth>
                    <InputLabel>Font Size</InputLabel>
                    <Select defaultValue="Medium">
                        <MenuItem value="Small">Small</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Large">Large</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box mt={2}>
                <Typography variant="body1">High Contrast Mode</Typography>
                <Switch color="primary" />
            </Box>
            <Box mt={2}>
                <Typography variant="body1">Screen Reader Support</Typography>
                <Switch color="primary" />
            </Box>
        </Box>
    );
};

export default AccessibilitySettings;
