import React, { useState } from 'react';
import { Box, Typography, Switch, FormControlLabel } from '@mui/material';

const AccountSettings = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);

    const handleToggle = (setter) => () => {
        setter(prev => !prev);
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Account Settings</Typography>
            <FormControlLabel
                control={<Switch checked={emailNotifications} onChange={handleToggle(setEmailNotifications)} />}
                label="Email Notifications"
            />
            <FormControlLabel
                control={<Switch checked={smsNotifications} onChange={handleToggle(setSmsNotifications)} />}
                label="SMS Notifications"
            />
        </Box>
    );
};

export default AccountSettings;
