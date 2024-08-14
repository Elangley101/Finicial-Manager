import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const PasswordReset = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordReset = () => {
        // Add logic to handle password reset
        console.log('Password reset requested');
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Password Reset</Typography>
            <TextField
                label="Current Password"
                type="password"
                fullWidth
                margin="normal"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
                label="New Password"
                type="password"
                fullWidth
                margin="normal"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handlePasswordReset}
                style={{ marginTop: '16px' }}
            >
                Reset Password
            </Button>
        </Box>
    );
};

export default PasswordReset;
