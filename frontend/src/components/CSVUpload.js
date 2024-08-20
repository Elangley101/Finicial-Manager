// src/components/CSVUpload.js

import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import axios from 'axios';

const CSVUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/upload-csv/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error uploading CSV');
            console.error('Error uploading CSV:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
                type="file"
                onChange={handleFileChange}
                fullWidth
                sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
                Upload CSV
            </Button>
            {message && <p>{message}</p>}
        </Box>
    );
};

export default CSVUpload;
