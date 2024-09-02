import React, { useState, useContext } from 'react';
import { Box, Typography, Button, Switch, Input } from '@mui/material';
import AuthContext from '../context/AuthContext'; // Make sure you're importing the correct context

const DataManagementSettings = () => {
    const { authTokens } = useContext(AuthContext); // Use context to get the auth tokens
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        if (!authTokens || !authTokens.access) {
            alert("User is not authenticated. Please log in again.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/api/upload-csv/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload CSV file');
            }

            const data = await response.json();
            console.log('CSV upload successful:', data);
            alert('CSV uploaded successfully.');
        } catch (error) {
            console.error('Error uploading CSV file:', error);
            alert('Error uploading CSV file.');
        }
    };

    return (
        <Box mb={4}>
            <Typography variant="h5" gutterBottom>Data Management</Typography>

            <Box mt={2}>
                <Typography variant="body1">Download CSV Template</Typography>
                <Button variant="contained" color="primary" onClick={() => window.location.href = 'http://localhost:8000/static/transaction_template.csv'}>
                    Download Template
                </Button>
            </Box>

            <Box mt={2}>
                <Typography variant="body1">Import Data</Typography>
                <Input type="file" inputProps={{ accept: ".csv" }} onChange={handleFileChange} />
                <Button variant="contained" color="secondary" onClick={handleFileUpload}>
                    Upload CSV
                </Button>
            </Box>

            <Box mt={2}>
                <Typography variant="body1">Export Data</Typography>
                <Button variant="contained" color="secondary">Export Data</Button>
            </Box>

            <Box mt={2}>
                <Typography variant="body1">Data Synchronization</Typography>
                <Switch color="primary" />
            </Box>
        </Box>
    );
};

export default DataManagementSettings;
