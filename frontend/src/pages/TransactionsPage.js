import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import TransactionForm from '../components/TransactionForm';
import CSVUpload from '../components/CSVUpload';
import Sidebar from '../components/Sidebar';  // Import your Sidebar component

const TransactionPage = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <Container sx={{ flexGrow: 1 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Manage Transactions
                </Typography>
                {/* Transaction Form */}
                <TransactionForm />
                {/* Separator or heading */}
                <Typography variant="h6" component="h2" gutterBottom>
                    Or Upload Transactions via CSV
                </Typography>
                {/* CSV Upload Form */}
                <CSVUpload />
            </Container>
        </Box>
    );
};

export default TransactionPage;
