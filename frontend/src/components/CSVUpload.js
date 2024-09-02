import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Alert } from '@mui/material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const CSVUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { authTokens } = useContext(AuthContext); // Get the authTokens from AuthContext

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/api/upload-csv/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authTokens.access}`, // Add Authorization header
                },
            });
            setMessage(response.data.message);
            setFile(null); // Reset the file input
        } catch (error) {
            setError('Error uploading CSV');
            console.error('Error uploading CSV:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {message && <Alert severity="success">{message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
                type="file"
                onChange={handleFileChange}
                fullWidth
                sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
                Upload CSV
            </Button>
        </Box>
    );
};

export default CSVUpload;
