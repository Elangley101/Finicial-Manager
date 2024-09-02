import React, { useState, useContext } from 'react';
import { Container, Typography, Box, Button, Collapse } from '@mui/material';
import TransactionForm from '../components/TransactionForm';
import CSVUpload from '../components/CSVUpload';
import ExpenseIncomeChart from '../components/ExpenseIncomeChart';
import TransactionList from '../components/TransactionList';
import Sidebar from '../components/Sidebar';
import AuthContext from '../context/AuthContext';

const TransactionPage = () => {
    const [open, setOpen] = useState(false); // State to control dropdown visibility
    const { authTokens } = useContext(AuthContext);

    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <Container sx={{ flexGrow: 1, ml: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Transactions Overview
                </Typography>

                {/* Expense vs Income Chart */}
                <ExpenseIncomeChart />

                {/* Transaction List */}
                <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 4 }}>
                    Your Transactions
                </Typography>
                <TransactionList />

                {/* Add Transaction & CSV Upload (Dropdown) */}
                <Button variant="contained" onClick={handleToggle} sx={{ mt: 4 }}>
                    {open ? 'Hide' : 'Add Transactions / Upload CSV'}
                </Button>
                <Collapse in={open} sx={{ mt: 2 }}>
                    <TransactionForm />
                    <CSVUpload />
                </Collapse>
            </Container>
        </Box>
    );
};

export default TransactionPage;
