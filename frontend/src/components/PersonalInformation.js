import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const PersonalInformation = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSave = () => {
        // Add logic to save personal information
        console.log('Personal information saved');
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Personal Information</Typography>
            <TextField
                label="Name"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Phone"
                type="tel"
                fullWidth
                margin="normal"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                style={{ marginTop: '16px' }}
            >
                Save
            </Button>
        </Box>
    );
};

export default PersonalInformation;
